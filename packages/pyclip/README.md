# Python CLIP service

A FastAPI-based service that uses OpenAI's CLIP model to tag images with relevant labels. The service is designed to tag pet species and their characteristics from uploaded images.

## Quick Start

### To start the service
First ensure Docker is downloaded and running (see root level README).

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

**Currently supported tags:**

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

**Local Development (if running outside Docker)**

- **Location**: `~/.cache/huggingface/hub/` on your host machine
- **Note**: Small metadata files (~40 bytes) might appear locally, but actual model files are in the container

#### Model Persistence

The model is downloaded fresh each time the container is rebuilt or restarted.

### Model Loading Process

1. The `load_model()` function runs when the FastAPI app starts
2. If not cached, the model downloads from Hugging Face Hub
3. Model files are stored in the container's cache directory
4. Model is loaded into memory for fast inference
5. Service accepts requests for image tagging


## Development

### Testing

```shell
# Test with a sample image
./scripts/test-clip.sh
```
