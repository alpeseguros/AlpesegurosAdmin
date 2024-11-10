from django.db import models
from django.contrib.auth.models import User

class PDFDocument(models.Model):
    uuid_pdf=models.TextField()
    nombre_cliente = models.TextField()
    email_cliente=models.EmailField()
    nombre_pdf=models.TextField()
    firmado = models.BooleanField(default=False)
    aprobado = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PDF {self.id} - {self.nombre_cliente}"