PAYMENT ZIP: орнату

1) Zip-ті ашып, Backend және Frontend папкаларын Hotel_Booking_System ішіне көшіріңіз (Replace таңдаңыз):
   unzip -o ~/Downloads/payment-booking.zip -d ~/Hotel_Booking_System

2) Backend (Backend папкасында):
   source venv/bin/activate
   python manage.py makemigrations bookings payments
   python manage.py migrate
   python manage.py runserver
   Алдын ала settings.py ішінде 'bookings', 'payments' бар болуы керек,
   config/urls.py ішінде path('api/payments/', include('payments.urls')) және
   path('api/bookings/', include('bookings.urls')) бар болуы керек.
   rooms.Room моделінде: name, price_per_night, capacity өрістері болуы керек.

3) Frontend:
   app.routes.ts ішіне қосыңыз:
   { path: 'payment/:bookingId', loadComponent: () => import('./pages/payment/payment').then(m => m.Payment) },
   Егер pages/payment ішінде ескі payment.html/payment.scss/payment.spec.ts қате берсе, өшіріңіз.

4) Тест карта: 4242 4242 4242 4242, мерзімі 12/30, CVV 123.
   API: POST /api/payments/ { "booking": 1, "card_number": "4242 4242 4242 4242", "expiry": "12/30" }

Ескерту: Booking файлдары (bookings/*) қосылған, себебі Payment соған тәуелді.
Егер Booking кодыңыз бұрыннан жазылған болса, оларды көшірмей-ақ қойыңыз.
