from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return (Booking.objects.filter(user=self.request.user)
                .select_related('room').order_by('-created_at'))

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'cancelled':
            return Response({'detail': 'Booking is already cancelled.'}, status=400)
        booking.status = 'cancelled'
        booking.save()
        return Response(self.get_serializer(booking).data)
