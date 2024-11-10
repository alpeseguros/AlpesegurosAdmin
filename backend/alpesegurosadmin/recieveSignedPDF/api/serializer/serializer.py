from rest_framework import serializers
from recieveSignedPDF.api.models.models import Firma


class FirmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Firma
        fields ="__all__"

    
