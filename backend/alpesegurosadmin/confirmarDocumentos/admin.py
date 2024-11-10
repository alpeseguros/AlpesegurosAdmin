from django.contrib import admin

# Register your models here.
from confirmarDocumentos.api.models.models import PDFDocumentSigned

admin.site.register(PDFDocumentSigned)