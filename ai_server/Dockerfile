FROM python:3.7-alpine

WORKDIR /code

RUN pip install flask
RUN pip install requests
RUN pip install websocket-client

EXPOSE 5555

# do not need to copy anything in since the correct folders are included in the volumes

# COPY . . since context is now parent directory, copy in the specific directories we want instead
# COPY ./ai_server .
# COPY ./game_logic game_logic

CMD ["python3", "ai_api.py"]
