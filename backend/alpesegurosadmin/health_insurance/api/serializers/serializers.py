# health_insurance/serializers.py

from rest_framework import serializers
from health_insurance.api.models.models import HealthInsuranceFormData

class HealthInsuranceFormDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthInsuranceFormData
        fields = ['nombre', 'telefono', 'email', 'provincia', 'asegurar', 'edad', 'aceptaProteccionDatos', 'deseaPromociones']
