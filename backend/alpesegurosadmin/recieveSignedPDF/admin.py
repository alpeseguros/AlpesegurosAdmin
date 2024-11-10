from django.contrib import admin

# Register your models here.
from recieveSignedPDF.api.models.models import Firma

admin.site.register(Firma)