from django.contrib import admin

# Register your models here.
from pdfGenerator.api.models.models import PDFDocument

admin.site.register(PDFDocument)