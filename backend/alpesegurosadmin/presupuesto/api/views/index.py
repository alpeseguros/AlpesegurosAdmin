from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from presupuesto.api.models.models import InsurancePremium
from presupuesto.api.serializers.serializers import InsurancePremiumSerializer
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

from rest_framework import viewsets
from presupuesto.api.models.models import Company, AgeBracket
from presupuesto.api.serializers.serializers import CompanySerializer, AgeBracketSerializer


class InsurancePremiumViewSet(ModelViewSet):
    queryset = InsurancePremium.objects.all()
    serializer_class = InsurancePremiumSerializer

    def list(self, request, *args, **kwargs):
        """Retrieve all Insurance Premium records."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single Insurance Premium record by ID."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """Create a new Insurance Premium record."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Update an existing Insurance Premium record."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """Partially update an existing Insurance Premium record."""
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete an existing Insurance Premium record."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'status': 'success', 'message': 'Record deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class InsurancePremiumDetailView(APIView):
    """
    Retrieve, update, or delete a single Insurance Premium record by ID and filter by age_bracket.
    """

    def get_object(self, pk, age_bracket=None):
        try:
            # Filtra por ID y, opcionalmente, por age_bracket
            queryset = InsurancePremium.objects.filter(pk=pk)
            if age_bracket:
                queryset = queryset.filter(age_bracket=age_bracket)
            return queryset.first()  # Devuelve el primer registro que coincida
        except InsurancePremium.DoesNotExist:
            raise NotFound(detail="Insurance Premium not found")

    def get(self, request, pk, *args, **kwargs):
        """Retrieve a single Insurance Premium record by ID and filter by age_bracket if provided."""
        age_bracket = request.query_params.get('age_bracket', None)
        instance = self.get_object(pk, age_bracket)
        if not instance:
            return Response({"detail": "Insurance Premium not found with the specified parameters."}, 
                            status=status.HTTP_404_NOT_FOUND)
        serializer = InsurancePremiumSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        """Update an existing Insurance Premium record."""
        instance = self.get_object(pk)
        serializer = InsurancePremiumSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        """Delete an existing Insurance Premium record."""
        instance = self.get_object(pk)
        instance.delete()
        return Response({'status': 'success', 'message': 'Record deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    # Listar todas las compañías
    def list(self, request, *args, **kwargs):
        print("Listing Companies...") 
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        print(serializer.data)  # Imprimir datos serializados
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Obtener detalles de una compañía específica
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Crear una nueva compañía
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Actualizar una compañía específica (reemplaza todos los campos)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Actualización parcial de una compañía (algunos campos)
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Eliminar una compañía específica
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AgeBracketViewSet(viewsets.ModelViewSet):
    queryset = AgeBracket.objects.all()
    serializer_class = AgeBracketSerializer

    # Listar todos los rangos de edad
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Obtener detalles de un rango de edad específico
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Crear un nuevo rango de edad
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Actualizar un rango de edad específico (reemplaza todos los campos)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Actualización parcial de un rango de edad (algunos campos)
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Eliminar un rango de edad específico
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

