from datetime import date
from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source='room.name', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'room', 'room_name', 'check_in', 'check_out', 'guests',
                  'guest_name', 'guest_email', 'guest_phone', 'total_price', 'status', 'created_at']
        read_only_fields = ['total_price', 'status', 'created_at']

    def validate(self, data):
        if data['check_in'] < date.today():
            raise serializers.ValidationError('Check-in date cannot be in the past.')
        if data['check_out'] <= data['check_in']:
            raise serializers.ValidationError('Check-out must be after check-in.')
        room = data['room']
        if data['guests'] > room.capacity:
            raise serializers.ValidationError(f'This room fits up to {room.capacity} guests.')
        busy = (Booking.objects.filter(room=room)
                .exclude(status='cancelled')
                .filter(check_in__lt=data['check_out'], check_out__gt=data['check_in'])
                .exists())
        if busy:
            raise serializers.ValidationError('This room is already booked for these dates.')
        return data

    def create(self, validated):
        nights = (validated['check_out'] - validated['check_in']).days
        validated['total_price'] = validated['room'].price_per_night * nights
        validated['user'] = self.context['request'].user
        return super().create(validated)
