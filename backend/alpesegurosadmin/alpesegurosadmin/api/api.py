
# profiles/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.urls import reverse_lazy

class ApiRoot(APIView):
    def get(self, request, format=None):
        return Response({

            'areaPrivada': request.build_absolute_uri(reverse_lazy('user-list')),
            'presupuesto': request.build_absolute_uri(reverse_lazy('user-list')),
            'userAdmin': request.build_absolute_uri(reverse_lazy('user-list')),
            'save_health_insurance': request.build_absolute_uri(reverse_lazy('save_health_insurance')),
            'premiumamount': request.build_absolute_uri(reverse_lazy('premium_insurance')),
            'User': request.build_absolute_uri(reverse_lazy('user-list')),
            'User_me' :request.build_absolute_uri(reverse_lazy('user-detail')),
            'auth':request.build_absolute_uri(reverse_lazy('token_obtain_pair')),
            'companies' :request.build_absolute_uri(reverse_lazy('companies')),
            'age_brackets':request.build_absolute_uri(reverse_lazy('age_brackets')),
            'generate_pdf':request.build_absolute_uri(reverse_lazy('generate_pdf')),
            'guardarfirma':request.build_absolute_uri(reverse_lazy('guardar_firma-list')),
            'confirm_document':request.build_absolute_uri(reverse_lazy('confirm_document'))
            
            
            
            

        })
