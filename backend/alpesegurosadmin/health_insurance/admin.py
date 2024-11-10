from django.contrib import admin

# Register your models here.
from  health_insurance.api.models.models import HealthInsuranceFormData

admin.site.register(HealthInsuranceFormData)

