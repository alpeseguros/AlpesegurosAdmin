from rest_framework.routers import DefaultRouter
from django.urls import path, include


from userAdmin.api.views.index import UserApiViewSet,UserView
from rest_framework_simplejwt.views import TokenObtainPairView



urlpatterns = [




path('auth/me',UserView.as_view(),name='user-detail'),
path('users/', UserApiViewSet.as_view({'get': 'list', 'post': 'create'}), name='user-list'),
path('auth/login/',TokenObtainPairView.as_view(),name='token_obtain_pair')

]