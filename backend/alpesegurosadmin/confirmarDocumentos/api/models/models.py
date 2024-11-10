from django.db import models

class PDFDocumentSigned(models.Model):
    uuid_pdf = models.CharField(max_length=255, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    uuid_firma = models.CharField(max_length=255)
    nombre_pdf = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre_pdf
