from django.urls import path, include
from rest_framework.routers import DefaultRouter
from backend.alpesegurosadmin.apps.health_insurance.api.views.index import (

    save_health_insurance,

)

# Crear un router
save_health_insurance_router = DefaultRouter()

save_health_insurance_router.register(r'save_health_insurance', save_health_insurance)