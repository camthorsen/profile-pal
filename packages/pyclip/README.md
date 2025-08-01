# Python CLIP service

A FastAPI-based service that uses OpenAI's CLIP model to tag images with relevant labels. The service is designed to identify pets and their characteristics from uploaded images.

## Quick Start

### To start the service

```shell
docker compose up --build
```

### To stop the service

```shell
docker compose down
```

## API Usage

Requests should be made to http://localhost:7860.

The expected format is multipart form data.
An example request is shown in `scripts/test-clip.sh`

### Endpoint: POST /tag

Upload an image file to get relevant tags with confidence scores.

**Supported tags:**
- Pet types: cat, dog, hamster, rabbit, bird, fish, turtle, snake, lizard
- Fur types: long-hair, short-hair, medium-hair

## Model Information

### Model Details
- **Model**: `openai/clip-vit-base-patch32`
- **Framework**: Hugging Face Transformers
- **Total Size**: ~1.2GB (when fully downloaded)

### Model Download and Storage

#### How It Works
When the service starts, the CLIP model is automatically downloaded from Hugging Face Hub and cached for future use. The model is loaded once at startup and kept in memory for the duration of the service.

#### Storage Locations

**Docker Container (Default)**
- **Location**: `/root/.cache/huggingface/hub/` inside the container
- **Model Directory**: `models--openai--clip-vit-base-patch32/`
- **Key Files**:
  - Main model weights: ~578MB
  - Additional model data: ~578MB
  - Configuration files: ~4MB
  - Total: ~1.2GB

**Local Development (if running outside Docker)**
- **Location**: `~/.cache/huggingface/hub/` on your host machine
- **Note**: Small metadata files (~40 bytes) may appear locally, but actual model files are in the container

#### Model Persistence

**Current Behavior**: The model is downloaded fresh each time the container is rebuilt or restarted.

**To Persist Models Across Container Restarts** (Optional):
Add a volume mount to `docker-compose.yaml`:

```yaml
services:
  clip-service:
    build: .
    ports:
      - "7860:7860"
    volumes:
      - ./models:/root/.cache/huggingface/hub  # Persist models
    restart: unless-stopped
```

This will store the model files in a `./models` directory on your host machine.

### Model Loading Process

1. **Startup**: The `load_model()` function runs when the FastAPI app starts
2. **Download**: If not cached, the model downloads from Hugging Face Hub
3. **Cache**: Model files are stored in the container's cache directory
4. **Memory**: Model is loaded into memory for fast inference
5. **Ready**: Service accepts requests for image tagging

### Performance Notes

- **First Run**: May take 1-2 minutes to download the model
- **Subsequent Runs**: Fast startup if model is cached
- **Memory Usage**: ~2-3GB RAM when model is loaded
- **Inference Speed**: ~100-500ms per image (depending on hardware)

## Development

### Testing
```shell
# Test with a sample image
./scripts/test-clip.sh
```

### Checking Model Files
```shell
# View model files in container
docker exec pyclip-clip-service-1 ls -lah /root/.cache/huggingface/hub/models--openai--clip-vit-base-patch32/blobs/

# Check total model size
docker exec pyclip-clip-service-1 du -sh /root/.cache/huggingface/hub/
```

### Troubleshooting

**Model Download Issues**:
- Check internet connection
- Verify Docker has sufficient disk space (~2GB free)
- Clear container cache: `docker compose down && docker system prune`

**Memory Issues**:
- Ensure Docker has at least 4GB RAM allocated
- Consider using a smaller CLIP model variant if needed
