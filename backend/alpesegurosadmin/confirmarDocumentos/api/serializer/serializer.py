from rest_framework import serializers
from confirmarDocumentos.api.models.models import PDFDocumentSigned

class PDFDocumentSignedSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFDocumentSigned
        fields = ['uuid_pdf', 'fecha_creacion', 'uuid_firma', 'nombre_pdf']
