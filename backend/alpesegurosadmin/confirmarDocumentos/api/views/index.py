import os
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.core.mail import EmailMessage
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from pdfGenerator.api.models.models import PDFDocument
from confirmarDocumentos.api.models.models import PDFDocumentSigned
from confirmarDocumentos.api.serializer.serializer  import PDFDocumentSignedSerializer
from recieveSignedPDF.api.models.models import Firma

class ConfirmDocumentView(APIView):
    def post(self, request, uuid_pdf):
        try:
            # Verificar si el PDF existe por uuid_pdf
            documentos = PDFDocument.objects.filter(uuid_pdf=uuid_pdf)
            if not documentos.exists():
                return Response({"detail": "El documento no existe."}, status=status.HTTP_404_NOT_FOUND)

            documento = documentos.first()

            # Ruta de la carpeta donde están los PDFs
            carpeta_pdfs = os.path.join('pdfsGenerados', 'pdfs', documento.uuid_pdf)

            # Obtener los archivos PDF a combinar
            archivos_pdf = sorted(
                [f for f in os.listdir(carpeta_pdfs) if f.endswith('.pdf')],
                key=lambda x: os.path.getctime(os.path.join(carpeta_pdfs, x))
            )

            if not archivos_pdf:
                return Response({"detail": "No se encontraron archivos PDF para combinar."}, status=status.HTTP_404_NOT_FOUND)

            # Crear un objeto PdfMerger
            merger = PdfMerger()

            # Añadir todos los PDFs a combinar
            for archivo in archivos_pdf:
                archivo_pdf = os.path.join(carpeta_pdfs, archivo)
                merger.append(archivo_pdf)

            # Crear un buffer para el PDF combinado
            output_buffer = BytesIO()
            merger.write(output_buffer)
            output_buffer.seek(0)  # Asegúrate de reposicionar el cursor al inicio del buffer

            # Obtener la firma asociada al documento
            firma = Firma.objects.filter(pdf_documento=uuid_pdf).first()
            if not firma:
                return Response({"detail": "No se encontró la firma asociada."}, status=status.HTTP_404_NOT_FOUND)

            # Ruta de la imagen de la firma
            ruta_imagen_firma = os.path.join('pdfsGenerados', 'firmas', firma.imagen_firma)

            # Cargar el PDF combinado en PdfReader
            pdf_combined = PdfReader(output_buffer)

            # Crear un buffer para la capa de la firma
            firma_overlay = BytesIO()
            firma_canvas = canvas.Canvas(firma_overlay, pagesize=letter)

            # Añadir el texto "Firma", una línea y la imagen de la firma en la superposición
            firma_canvas.drawString(100, 130, "Firma:")
            firma_canvas.line(150, 125, 350, 125)  # Dibuja la línea para la firma
            firma_canvas.drawImage(ruta_imagen_firma, 150, 130, width=200, height=50, mask='auto')  # Firma encima de la línea


            firma_canvas.save()
            firma_overlay.seek(0)

            # Crear un objeto PdfWriter para el PDF final
            writer = PdfWriter()

            # Añadir todas las páginas del PDF combinado excepto la última
            for page_num in range(len(pdf_combined.pages) - 1):
                writer.add_page(pdf_combined.pages[page_num])

            # Combinar la última página con la superposición de la firma
            overlay_pdf = PdfReader(firma_overlay)
            last_page = pdf_combined.pages[-1]
            last_page.merge_page(overlay_pdf.pages[0])
            writer.add_page(last_page)

            # Crear un buffer para el PDF final con la firma
            output_buffer_firmado = BytesIO()
            writer.write(output_buffer_firmado)
            output_buffer_firmado.seek(0)

            # Guardar el PDF combinado con la firma
            nombre_pdf_combinado = f"documento_firmado_{timezone.now().strftime('%Y%m%d%H%M%S')}.pdf"
            pdf_guardado = os.path.join(carpeta_pdfs, nombre_pdf_combinado)

            with open(pdf_guardado, 'wb') as f:
                f.write(output_buffer_firmado.getvalue())

            # Actualizar el modelo de base de datos
            documento.nombre_pdf = nombre_pdf_combinado
            documento.save()

            # Enviar el PDF por correo
            email = EmailMessage(
                subject="Documento PDF Firmado",
                body="Adjunto el documento PDF firmado.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=["djangopruebas61@gmail.com"],  # Cambia por el correo real
            )

            # Adjuntar el PDF combinado firmado
            email.attach(nombre_pdf_combinado, output_buffer_firmado.getvalue(), 'application/pdf')

            # Enviar el correo
            email.send()

            return Response({"detail": "PDF combinado, firmado y enviado por correo."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)