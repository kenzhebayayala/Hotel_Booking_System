from django.conf import settings
from django.db import models


class Booking(models.Model):
    STATUS = [('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey('rooms.Room', on_delete=models.CASCADE, related_name='bookings')
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveSmallIntegerField(default=1)
    guest_name = models.CharField(max_length=120)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=30, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Booking #{self.pk} {self.room} {self.check_in}-{self.check_out}'
