from django.urls import path, include
from rest_framework.routers import DefaultRouter
from backend.alpesegurosadmin.presupuesto.api.views.index import (

    InsurancePremiumViewSet,
    CompanyViewSet,
    AgeBracketViewSet

)

# Crear un router
premium_insurance_router = DefaultRouter()

premium_insurance_router.register(r'premium_insurance', InsurancePremiumViewSet)
premium_insurance_router.register(r'companies', CompanyViewSet)
premium_insurance_router.register(r'age_brackets', AgeBracketViewSet)