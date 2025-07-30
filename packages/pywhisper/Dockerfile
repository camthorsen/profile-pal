# Multi-stage build to reduce final image size
FROM python:3.11-slim as builder

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set environment variables for CPU-only PyTorch
ENV TORCH_CUDA_ARCH_LIST=""
ENV CUDA_VISIBLE_DEVICES=""

WORKDIR /app

# Install system dependencies for building
RUN apt-get update && apt-get install --yes --no-install-recommends \
    build-essential pkg-config && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --upgrade pip && pip install poetry

# Copy pyproject.toml
COPY pyproject.toml ./

# Install CPU-only PyTorch first (smaller, more stable)
RUN pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install other dependencies using Poetry
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --only main

# Final stage - runtime
FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set environment variables for CPU-only PyTorch
ENV TORCH_CUDA_ARCH_LIST=""
ENV CUDA_VISIBLE_DEVICES=""

WORKDIR /app

# Install only runtime system dependencies
RUN apt-get update && apt-get install --yes --no-install-recommends \
    ffmpeg libsndfile1 libportaudio2 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy source code
COPY app ./app

# Expose port for FastAPI
EXPOSE 7861

# Run FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7861"]
