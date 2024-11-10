from django.contrib import admin

# Register your models here.
from presupuesto.api.models.models import Company,AgeBracket,InsurancePremium

admin.site.register(Company)
admin.site.register(AgeBracket)
admin.site.register(InsurancePremium)
