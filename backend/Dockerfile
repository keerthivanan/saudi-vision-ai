# 🧠 BACKEND DOCKERFILE (NEW & OPTIMIZED)
# Stage 1: Builder (Compiling Dependencies)
FROM python:3.11-slim as builder

WORKDIR /app

# Prevent Python from buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install GCC and System Libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Dependencies into a wheel directory
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Stage 2: Runner (Runtime Only)
FROM python:3.11-slim

WORKDIR /app

# Install only huge runtime libs (Postgres)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy compiled wheels from Builder
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .

# Install dependencies from wheels
RUN pip install --no-cache --no-index /wheels/*

# Copy Application Code
COPY . .

# Security: Create non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

# Expose Port
EXPOSE 8000

# Start Command via Native Module
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
