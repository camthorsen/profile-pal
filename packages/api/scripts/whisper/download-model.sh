#!/usr/bin/env zsh

set -euo pipefail

REPO_DIR=~/repos/clones
WHISPER_DIR="$REPO_DIR/whisper.cpp"
MODEL_NAME=ggml-tiny.en.bin

echo "🔧 Downloading whisper.cpp $MODEL_NAME..."

# Ensure base directory exists
mkdir -p "$REPO_DIR"

# Download the model if not already present
if [ ! -f "$WHISPER_DIR/models/$MODEL_NAME" ]; then
  echo "Downloading model: $MODEL_NAME"
  bash "$WHISPER_DIR/models/download-ggml-model.sh" tiny.en
else
  echo "Model $MODEL_NAME already exists."
fi

echo "✅ whisper.cpp download of $MODEL_NAME complete."
