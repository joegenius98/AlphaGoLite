# chat/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('wss/rooms/<uri>/',  consumers.ChatConsumer.as_asgi()),
]
