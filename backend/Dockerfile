FROM python:3.10-slim

WORKDIR /app

# Install build dependencies for scientific packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Initialize db using a startup script or wait-for-it
CMD ["python", "app.py"]
