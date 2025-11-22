FROM python:3.10-slim

# Install system dependencies needed to build dlib and OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake git pkg-config libgtk-3-dev libboost-all-dev \
    libjpeg-dev libpng-dev libtiff-dev libatlas-base-dev libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy dependency list and install
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /app/requirements.txt

# copy the app
COPY . /app

ENV PYTHONUNBUFFERED=1
EXPOSE 5000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
