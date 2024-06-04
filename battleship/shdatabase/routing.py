'''
routing.py
Kendra Winhall
Adapted from this Django Channels tutorial: 
https://channels.readthedocs.io/en/stable/tutorial/index.html

Defines routing for websocket messages
'''

from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/play/(?P<room_name>\w+)/$", consumers.GameConsumer.as_asgi())
]