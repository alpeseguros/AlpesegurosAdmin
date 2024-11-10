from rest_framework import serializers
from presupuesto.api.models.models import InsurancePremium
from presupuesto.api.models.models import Company, AgeBracket


class InsurancePremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsurancePremium
        fields = ['company', 'age_bracket', 'premium_amount']
        

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id','name']


class AgeBracketSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgeBracket
        fields = ['id','age']
