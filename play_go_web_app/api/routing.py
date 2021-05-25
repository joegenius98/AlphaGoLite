# chat/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/rooms/<uri>/',  consumers.ChatConsumer.as_asgi()),
]