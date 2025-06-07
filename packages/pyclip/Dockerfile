FROM python:3.11-slim

# Avoid interactive prompts during install
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for Pillow
RUN apt-get update && apt-get install --yes --no-install-recommends \
    libjpeg-dev zlib1g-dev libpng-dev libopenblas-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --upgrade pip && pip install poetry

# Copy pyproject and lockfile
COPY pyproject.toml poetry.lock* ./

# Install dependencies (system-level, no venv)
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

# Copy app code
COPY app ./app

# Expose port for FastAPI
EXPOSE 7860

# Start FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
