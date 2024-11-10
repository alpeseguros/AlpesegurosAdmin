from django.db import models

class Firma(models.Model):
    uuid_firma = models.TextField(default="n")
    ip = models.CharField(max_length=255)
    hora = models.TimeField()
    fecha_firmado = models.DateField()
    pdf_documento = models.CharField(max_length=255)
    imagen_firma = models.CharField(max_length=255)

    def __str__(self):
        return str(self.uuid_firma)
