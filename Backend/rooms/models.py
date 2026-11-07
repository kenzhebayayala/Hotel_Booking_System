from django.db import models


class Room(models.Model):
    name = models.CharField(max_length=100)
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    capacity = models.PositiveSmallIntegerField(default=2)

    def __str__(self):
        return self.name