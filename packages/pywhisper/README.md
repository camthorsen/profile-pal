# Python Whisper service

A FastAPI-based service that uses OpenAI's Whisper model to transcribe audio files. The service is designed to convert speech to text for pet profile generation and other audio processing needs.

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

The model is downloaded fresh each time the container is rebuilt or restarted.

### Model Loading Process

1. The `whisper.load_model("tiny")` function runs when the FastAPI app starts
2. If not cached, the model downloads from OpenAI's repository
3. Model file is stored in the container's cache directory
4. Model is loaded into memory for fast transcription
5. Service accepts requests for audio transcription

## Development

### Testing

```shell
# Test with a sample audio file
./scripts/test-whisper.sh

# Run integration tests
./scripts/test-integration.sh
```

### Audio Processing

The service uses FFmpeg for audio processing, which supports:

- Multiple input formats (MP3, WAV, M4A, etc.)
- Automatic format conversion
- Audio preprocessing for optimal transcription
