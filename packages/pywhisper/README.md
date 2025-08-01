# Python Whisper service

A FastAPI-based service that uses OpenAI's Whisper model to transcribe audio files. The service is designed to convert speech to text for pet profile generation and other audio processing needs.

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

Requests should be made to http://localhost:7861.

The expected format is multipart form data.
An example request is shown in `scripts/test-whisper.sh`

### Endpoint: POST /audio/transcribe

Upload an audio file to get a text transcript.

**Supported audio formats:**
- MP3, MP4, M4A, WAV, FLAC, WEBM, and other common audio formats
- Files are processed using FFmpeg for format conversion

**Response format:**
```json
{
  "transcript": "The transcribed text from the audio file"
}
```

## Model Information

### Model Details
- **Model**: `whisper-tiny`
- **Framework**: OpenAI Whisper (via `openai-whisper` package)
- **Total Size**: ~39MB (when fully downloaded)
- **Language Support**: Multilingual (automatically detects language)
- **Optimization**: CPU-only PyTorch for smaller image size

### Model Download and Storage

#### How It Works
When the service starts, the Whisper tiny model is automatically downloaded from OpenAI's model repository and cached for future use. The model is loaded once at startup and kept in memory for the duration of the service.

#### Storage Locations

**Docker Container (Default)**
- **Location**: `/root/.cache/whisper/` inside the container
- **Model File**: `tiny.pt` (~39MB)
- **Cache Structure**:
  ```
  /root/.cache/whisper/
  └── tiny.pt  # Main model weights
  ```

**Local Development (if running outside Docker)**
- **Location**: `~/.cache/whisper/` on your host machine
- **Model File**: `tiny.pt` (~39MB)

#### Model Persistence

**Current Behavior**: The model is downloaded fresh each time the container is rebuilt or restarted.

**To Persist Models Across Container Restarts** (Optional):
Add a volume mount to `docker-compose.yaml`:

```yaml
services:
  whisper-service:
    build: .
    ports:
      - "7861:7861"
    volumes:
      - ./models:/root/.cache/whisper  # Persist models
    restart: unless-stopped
```

This will store the model files in a `./models` directory on your host machine.

### Model Loading Process

1. **Startup**: The `whisper.load_model("tiny")` function runs when the FastAPI app starts
2. **Download**: If not cached, the model downloads from OpenAI's repository
3. **Cache**: Model file is stored in the container's cache directory
4. **Memory**: Model is loaded into memory for fast transcription
5. **Ready**: Service accepts requests for audio transcription

### Performance Notes

- **First Run**: May take 30-60 seconds to download the model
- **Subsequent Runs**: Fast startup if model is cached
- **Memory Usage**: ~100-200MB RAM when model is loaded
- **Transcription Speed**: ~1-3x real-time (depending on audio length and hardware)
- **CPU Usage**: Moderate (CPU-only inference)

### Model Variants

The service uses the "tiny" model for speed and efficiency. Other available Whisper models (if you want to modify the code):
- `tiny` (39MB) - Fastest, good for most use cases
- `base` (74MB) - Better accuracy, still fast
- `small` (244MB) - Better accuracy, moderate speed
- `medium` (769MB) - High accuracy, slower
- `large` (1550MB) - Best accuracy, slowest

## Development

### Testing
```shell
# Test with a sample audio file
./scripts/test-whisper.sh

# Run integration tests
./scripts/test-integration.sh
```

### Checking Model Files
```shell
# View model files in container
docker exec pywhisper-whisper-service-1 ls -lah /root/.cache/whisper/

# Check model file size
docker exec pywhisper-whisper-service-1 du -sh /root/.cache/whisper/
```

### Audio Processing

The service uses FFmpeg for audio processing, which supports:
- Multiple input formats (MP3, WAV, M4A, etc.)
- Automatic format conversion
- Audio preprocessing for optimal transcription

### Troubleshooting

**Model Download Issues**:
- Check internet connection
- Verify Docker has sufficient disk space (~100MB free)
- Clear container cache: `docker compose down && docker system prune`

**Audio Processing Issues**:
- Ensure audio file is not corrupted
- Check file format is supported
- Verify audio file contains speech (not just silence)

**Memory Issues**:
- Ensure Docker has at least 1GB RAM allocated
- Consider using a smaller model variant if needed

**Performance Optimization**:
- For production, consider using larger models for better accuracy
- GPU acceleration can be enabled by modifying the Dockerfile
- Batch processing can be implemented for multiple files

## Architecture Notes

- **Multi-stage Docker build**: Reduces final image size by separating build and runtime dependencies
- **CPU-only PyTorch**: Optimized for deployment without GPU requirements
- **FFmpeg integration**: Handles various audio formats automatically
- **Temporary file handling**: Audio files are processed in temporary storage for security
