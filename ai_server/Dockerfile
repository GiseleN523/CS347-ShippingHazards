FROM python:3.7-alpine

WORKDIR /code

RUN pip install flask
RUN pip install requests
RUN pip install websockets

EXPOSE 5555

COPY . .

CMD ["python3", "ai_api.py"]
