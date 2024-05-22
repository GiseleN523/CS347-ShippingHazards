# Pull base image
FROM python:3.11.5-slim-bullseye

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt
RUN pip install requests
RUN pip install asgiref
RUN pip install redis
RUN python3 -m pip install -U channels["daphne"]
RUN python3 -m pip install channels_redis

# Copy project
COPY . .