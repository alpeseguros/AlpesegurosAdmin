from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from pdfGenerator.api.models.models import PDFDocument
from recieveSignedPDF.api.models.models import Firma
from recieveSignedPDF.api.serializer.serializer import FirmaSerializer
from django.shortcuts import get_object_or_404
import uuid
from django.utils import timezone
from io import BytesIO
from PIL import Image
import base64
import re
from django.core.files.uploadedfile import InMemoryUploadedFile

class GuardarFirmaView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtener todas las firmas
        firmas = Firma.objects.all()
        # Serializar las firmas
        serializer = FirmaSerializer(firmas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, uuid_pdf):
        # Validamos que se haya recibido la firma
        firma_base64 = request.data.get('firma', None)
        print(firma_base64)
        print(request.data['documento_id'])
        print(request.data['ip'])
        base64_string=firma_base64
        # Elimina el prefijo 'data:image/png;base64,' si es necesario
        if base64_string.startswith('data:image/png;base64,'):
            base64_string = base64_string.replace('data:image/png;base64,', '')

        # Decodifica la cadena Base64
        image_data = base64.b64decode(base64_string)

       

        if not firma_base64:
            return Response({"error": "No se recibió la firma"}, status=status.HTTP_400_BAD_REQUEST)

        # Validamos el formato de la imagen base64
        match = re.match(r'data:image/(?P<ext>\w+);base64,(?P<data>.+)', firma_base64)
        if match:
            image_data = base64.b64decode(match.group('data'))
            image = Image.open(BytesIO(image_data))

            # Guardar la imagen como archivo en el servidor
            # Necesitamos convertir image_data en un archivo de tipo InMemoryUploadedFile
            file = BytesIO(image_data)
            imagen_firma = InMemoryUploadedFile(
                file,
                'firma',  # Nombre del campo del formulario, por ejemplo 'firma'
                f"{uuid.uuid4()}.png",  # Nombre del archivo basado en uuid
                "image/png",  # Tipo MIME
                len(image_data),  # Tamaño en bytes
                None  # Este es el tamaño del chunk, lo dejamos como None
            )

            # Obtener el documento al que pertenece la firma
            documento = get_object_or_404(PDFDocument, uuid_pdf=uuid_pdf)
            print(documento,type(documento.nombre_pdf))
            print(imagen_firma,type(imagen_firma.name))

             # Guarda la imagen en un archivo local
            with open(f"pdfsGenerados/firmas/{imagen_firma.name}", "wb") as file:
                file.write(image_data)

            print("Imagen guardada como imagen_guardada.png")
            # Crear los datos para la firma
            firma_data = {
                'imagen_firma': imagen_firma.name,
                'pdf_documento': request.data['documento_id'],
                'uuid_firma': str(uuid.uuid4()),
                'hora': timezone.now().time(),
                'fecha_firmado': timezone.now().date(),
                'ip':request.data['ip'],
                
            }
            

            # Usar el serializer para crear la firma
           
            serializer = FirmaSerializer(data=firma_data, context={'request': request})
            print("holaaa",firma_data)
            print(serializer,serializer.is_valid())
            if serializer.is_valid():
                print("validó")
                serializer.save()
                return Response({"mensaje": "Firma guardada exitosamente"}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Formato de imagen inválido"}, status=status.HTTP_400_BAD_REQUEST)
