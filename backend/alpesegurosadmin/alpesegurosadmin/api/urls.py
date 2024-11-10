from rest_framework.routers import DefaultRouter
from django.urls import path, include

from alpesegurosadmin.api.api import ApiRoot


from health_insurance.api.views.index import HealthInsuranceFormDataViewSet
from presupuesto.api.views.index import InsurancePremiumViewSet,InsurancePremiumDetailView
from userAdmin.api.views.index import UserApiViewSet,UserView
from presupuesto.api.views.index import AgeBracketViewSet,CompanyViewSet
from pdfGenerator.api.views.index import GeneratePDFView,GeneratePDFViewDetail
from recieveSignedPDF.api.views.index import GuardarFirmaView
from confirmarDocumentos.api.views.index import ConfirmDocumentView
from rest_framework_simplejwt.views import TokenObtainPairView



urlpatterns = [
path('',ApiRoot.as_view(), name='api-root'),
 path('confirmDocument/<str:uuid_pdf>/', ConfirmDocumentView.as_view(), name='confirm_document'),
path('guardar_firma/', GuardarFirmaView.as_view(), name='guardar_firma-list'),

 path('guardar_firma/<uuid:uuid_pdf>/', GuardarFirmaView.as_view(), name='guardar_firma'),

path('save_health_insurance/',HealthInsuranceFormDataViewSet.as_view({'get': 'list', 'post': 'create'}),name='save_health_insurance'),
path('premium_insurance/',InsurancePremiumViewSet.as_view({'get': 'list', 'post': 'create'}),name='premium_insurance'),
 path('premium_insurance/<int:pk>/', InsurancePremiumDetailView.as_view(), name='premium_insurance_detail'),  # Nueva URL para detalle
path('age_brackets/',AgeBracketViewSet.as_view({'get': 'list', 'post': 'create'}),name='age_brackets'),
path('companies/',CompanyViewSet.as_view({'get': 'list', 'post': 'create'}),name='companies'),
path('generate_pdf/',GeneratePDFView.as_view(),name='generate_pdf'),
path('generate_pdf/<uuid:uuid_pdf>/', GeneratePDFViewDetail.as_view(), name='generate_pdf'),
 # Detalles, actualizar y eliminar AgeBracket por ID
path('age_brackets/<int:pk>/', AgeBracketViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='age_bracket_detail'),

    # Detalles, actualizar y eliminar Company por ID
path('companies/<int:pk>/', CompanyViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='company_detail'),


path('auth/me',UserView.as_view(),name='user-detail'),
path('users/', UserApiViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-list'),

path('auth/login/',TokenObtainPairView.as_view(),name='token_obtain_pair')

]