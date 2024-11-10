from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
from django.core.mail import EmailMessage
from reportlab.lib.pagesizes import letter
from django.core.files.storage import default_storage
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os
import io
from io import BytesIO
from django.conf import settings
from reportlab.lib.pagesizes import letter
from pdfGenerator.api.models.models import PDFDocument
from pdfGenerator.api.serializer.serializer import PDFDocumentSerializer
import uuid
from django.utils import timezone
import base64
from recieveSignedPDF.api.models.models import Firma
from recieveSignedPDF.api.serializer.serializer import FirmaSerializer
import re


class GeneratePDFView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data  # Captura los datos en formato JSON

        # Filtrar los campos que no deben incluirse en el PDF
        campos_excluidos = ['uuid_pdf', 'firmado', 'aprobado', 'nombre_cliente', 'email_cliente', 'nombre_pdf']
         # Usar regex para excluir campos que coincidan con el patrón file_#
        datos_para_pdf = {
            k: v for k, v in data.items()
            if k not in campos_excluidos and not re.match(r'^file_\d+$', k)
        }
        # Genera el PDF
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Agregar logo en la parte superior
        logo_path = r'C:\Users\luis\Downloads\requisitoALPESEGUROS (2)\requisitoALPESEGUROS\backend\alpesegurosadmin\pdfGenerator\api\views\IMG-20241104-WA0010.jpg'
        p.drawImage(logo_path, 100, height - 80, width=200, height=50)

        # Título del documento
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, height - 140, "Resumen de Negociación")

        # Configuración para los campos (bordes, tipo de letra)
        p.setFont("Helvetica", 12)

        # Dibuja los campos en el PDF sin incluir los excluidos
        y_position = height - 180
        for field_name, field_value in datos_para_pdf.items():
            p.setStrokeColor(colors.black)
            p.setFillColor(colors.whitesmoke)
            p.rect(100, y_position - 15, 400, 25, fill=1)  # Dibuja el recuadro
            p.setFillColor(colors.black)
            p.drawString(110, y_position, f"{field_name}: {field_value}")
            y_position -= 40  # Espacio entre los campos

       
        # Añadir un enlace en el cuerpo del correo
        link = f"http://localhost:3000/pdfSignature/{data.get('uuid_pdf')}"
        y_position -= 60  # Separar un poco de los campos
        p.setFont("Helvetica-Bold", 10)
        p.drawString(100, y_position, f"Para más información, visita: {link}")

        p.showPage()
        p.save()

        # Obtener el PDF generado
        buffer.seek(0)
        pdf = buffer.getvalue()
        buffer.close()
        
        # Guardar el PDF en el servidor
        ruta_carpeta = os.path.join('pdfsGenerados', 'pdfs', data.get("uuid_pdf"))
        os.makedirs(ruta_carpeta, exist_ok=True)
        pdf_save_path = os.path.join(ruta_carpeta, f'documento-{data.get("uuid_pdf")}.pdf')

        with open(pdf_save_path, 'wb') as f:
            f.write(pdf)

        # Guardar los archivos adjuntos
        saved_files_paths = []
        file_index = 0
        
        while True:
            file_key = f'file_{file_index}'
            uploaded_file = request.FILES.get(file_key)
            if not uploaded_file:
                break
            file_path = os.path.join('pdfsGenerados', 'pdfs', data.get("uuid_pdf"))
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            pdf_save_path_files = os.path.join(file_path, uploaded_file.name)
            saved_path = default_storage.save(pdf_save_path_files, uploaded_file)
            saved_files_paths.append(saved_path)
            print(f"Archivo {file_key} guardado en:", saved_path)
            file_index += 1

        # Guardar la información en la base de datos
        pdf_data = {
            "uuid_pdf": data.get('uuid_pdf'),
            "nombre_cliente": data.get('nombre'),
            "email_cliente": data.get('email'),
            "nombre_pdf": f'documento-{data.get("nombre")}-{data.get("email")}.pdf',
            "firmado": False,
            "aprobado": False,
            "fecha_creacion": timezone.now(),
        }
        serializer = PDFDocumentSerializer(data=pdf_data)
        
        if serializer.is_valid():
            serializer.save()

            # Preparar el correo
            email = EmailMessage(
                subject='Formulario Personalizado',
                body=f'Adjunto los documentos necesarios además del link para firmar: {link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[data.get('email')],
            )
            email.attach('formulario_personalizado.pdf', pdf, 'application/pdf')

            # Adjuntar archivos recibidos
            for file_path in saved_files_paths:
                email.attach_file(file_path)

            try:
                email.send()
                return Response({'message': 'PDF y archivos enviados exitosamente'}, status=status.HTTP_200_OK)
            except Exception as e:
                print("Error al enviar el correo:", e)
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
  
    def get(self, request, *args, **kwargs):
        # Recuperar todos los documentos y sus firmas asociadas
        documentos = PDFDocument.objects.all()
        
        # Aquí se puede hacer una consulta para obtener las firmas asociadas a cada documento
        documentos_con_firmas = []

        for documento in documentos:
            firma = Firma.objects.filter(pdf_documento=documento).first()  # Asumiendo que cada documento tiene una firma asociada
            # Puedes agregar la firma al documento
            documento_data = PDFDocumentSerializer(documento).data
            if firma:
                firma_data = FirmaSerializer(firma).data
                documento_data['firma'] = firma_data  # Asociar la firma al documento
            documentos_con_firmas.append(documento_data)

        return Response(documentos_con_firmas, status=status.HTTP_200_OK)
        
class GeneratePDFViewDetail(APIView):
    
  
    def get(self, request, *args, **kwargs):
        uuid_pdf = kwargs.get('uuid_pdf')
        
        # Busca el documento basado en el UUID proporcionado
        documento = get_object_or_404(PDFDocument, uuid_pdf=uuid_pdf)
        
        if documento.nombre_pdf:
            pdf_path = os.path.join('pdfsGenerados', 'pdfs', documento.uuid_pdf)

            
            os.makedirs(pdf_path, exist_ok=True)

            pdf_save_path = os.path.join(pdf_path ,f'documento-{documento.uuid_pdf}.pdf')
            print(pdf_save_path)
            try:
                # Lee el PDF y codifícalo en base64
                with open(pdf_save_path, 'rb') as pdf_file:
                    pdf_base64 = base64.b64encode(pdf_file.read()).decode('utf-8')
                
                # Retorna el nombre del PDF y el contenido codificado en base64
                return Response({
                    'nombre_pdf': documento.nombre_pdf,
                    'pdf_base64': pdf_base64
                }, status=status.HTTP_200_OK)
            except FileNotFoundError:
                raise Http404("PDF no encontrado en el sistema de archivos.")
        else:
            return Response({'error': 'No se encontró un PDF asociado al UUID proporcionado.'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, *args, **kwargs):
        uuid_pdf = kwargs.get('uuid_pdf')
        
        # Busca el documento basado en el UUID proporcionado
        documento = get_object_or_404(PDFDocument, uuid_pdf=uuid_pdf)
        
        # Actualizar los campos según los datos enviados en el cuerpo de la solicitud
        firmado = request.data.get('firmado', documento.firmado)
        aprobado = request.data.get('aprobado', documento.aprobado)

        documento.firmado = firmado
        documento.aprobado = aprobado
        documento.save()

        # Retornar la respuesta con el estado actualizado del documento
        return Response({
            'message': 'Documento actualizado exitosamente.',
            'firmado': documento.firmado,
            'aprobado': documento.aprobado
        }, status=status.HTTP_200_OK)