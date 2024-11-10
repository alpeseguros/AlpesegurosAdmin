from rest_framework import serializers
from pdfGenerator.api.models.models import PDFDocument

class PDFDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFDocument
        fields = ['uuid_pdf', 'nombre_cliente', 'email_cliente', 'nombre_pdf', 'firmado', 'aprobado', 'fecha_creacion']
