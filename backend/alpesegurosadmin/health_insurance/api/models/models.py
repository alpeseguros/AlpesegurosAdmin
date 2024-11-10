from django.db import models

class HealthInsuranceFormData(models.Model):
    nombre = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    email = models.EmailField()
    provincia = models.CharField(max_length=100)
    asegurar = models.CharField(max_length=255)
    edad = models.IntegerField()
    aceptaProteccionDatos = models.BooleanField()
    deseaPromociones = models.BooleanField()
