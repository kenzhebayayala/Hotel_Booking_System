from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/users/', include('users.urls')),
    path('api/hotels/', include('hotels.urls')),
    path('api/rooms/', include('rooms.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/payments/', include('payments.urls')),
]