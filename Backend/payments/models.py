from django.db import models


class Payment(models.Model):
    booking = models.OneToOneField('bookings.Booking', on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    card_last4 = models.CharField(max_length=4)
    status = models.CharField(max_length=10, default='paid')
    paid_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Payment #{self.pk} for booking #{self.booking_id}'
