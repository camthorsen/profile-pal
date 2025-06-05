#!/usr/bin/env zsh

set -euo pipefail

REPO_DIR=~/repos/clones
WHISPER_DIR="$REPO_DIR/whisper.cpp"
MODEL_NAME=ggml-tiny.en.bin

# Ensure base directory exists
mkdir -p "$REPO_DIR"

# Clone the repo if it doesn't already exist
if [ ! -d "$WHISPER_DIR" ]; then
  echo "Cloning whisper.cpp into $WHISPER_DIR..."
  git clone https://github.com/ggerganov/whisper.cpp.git "$WHISPER_DIR"
else
  echo "whisper.cpp already cloned."
fi

# Build the binary
echo "Building whisper.cpp..."
make -C "$WHISPER_DIR"

# Download the model if not already present
if [ ! -f "$WHISPER_DIR/models/$MODEL_NAME" ]; then
  echo "Downloading model: $MODEL_NAME"
  bash "$WHISPER_DIR/models/download-ggml-model.sh" tiny.en
else
  echo "Model $MODEL_NAME already exists."
fi

echo "✅ whisper.cpp setup complete."
