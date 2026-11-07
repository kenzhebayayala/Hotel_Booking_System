from datetime import date

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking
from .models import Payment


def expiry_ok(value):
    try:
        mm, yy = str(value).split('/')
        mm, yy = int(mm), 2000 + int(yy)
    except ValueError:
        return False
    today = date.today()
    return 1 <= mm <= 12 and (yy, mm) >= (today.year, today.month)


class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking = get_object_or_404(Booking, pk=request.data.get('booking'), user=request.user)
        if booking.status != 'pending':
            return Response({'detail': 'This booking cannot be paid.'}, status=400)

        card = str(request.data.get('card_number', '')).replace(' ', '')
        if not (card.isdigit() and len(card) == 16):
            return Response({'detail': 'Enter a 16-digit card number.'}, status=400)
        if not expiry_ok(request.data.get('expiry', '')):
            return Response({'detail': 'Card has expired or the date is invalid. Use MM/YY.'}, status=400)

        with transaction.atomic():
            Payment.objects.create(booking=booking, amount=booking.total_price, card_last4=card[-4:])
            booking.status = 'confirmed'
            booking.save()

        return Response({'booking': booking.id, 'status': 'confirmed', 'card_last4': card[-4:]}, status=201)
