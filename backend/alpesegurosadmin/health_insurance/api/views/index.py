# health_insurance/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from health_insurance.api.models.models import HealthInsuranceFormData
from health_insurance.api.serializers.serializers import HealthInsuranceFormDataSerializer

class HealthInsuranceFormDataViewSet(ModelViewSet):
    queryset = HealthInsuranceFormData.objects.all()
    serializer_class = HealthInsuranceFormDataSerializer

    def list(self, request, *args, **kwargs):
        """Retrieve all Health Insurance records."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single Health Insurance record by ID."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """Create a new Health Insurance record."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Update an existing Health Insurance record."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """Partially update an existing Health Insurance record."""
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete an existing Health Insurance record."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'status': 'success', 'message': 'Record deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
