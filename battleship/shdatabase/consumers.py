'''
Modified from this Django Channels tutorial: 
https://channels.readthedocs.io/en/stable/tutorial/index.html
'''
import json

from channels.generic.websocket import AsyncWebsocketConsumer


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "game_%s" % self.room_name

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group that player changed game state
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "game_message", "message": message}
        )

    # Receive message from room group
    async def game_message(self, event):
        message = event["message"]

        # Send message to WebSocket to tell players to get state
        await self.send(text_data=json.dumps({"message": message}))
