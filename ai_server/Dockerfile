FROM python:3.7-alpine

WORKDIR /code

RUN pip install flask
RUN pip install requests

EXPOSE 7000

COPY . .

CMD ["python3", "ai_api.py"]
