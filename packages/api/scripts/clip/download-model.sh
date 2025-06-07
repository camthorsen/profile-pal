#!/usr/bin/env zsh
set -euo pipefail

CLIP_MODEL_NAME=clip-vit-base-patch32.gguf
CLIP_DIR=~/repos/clones/clip.cpp
MODEL_DIR="$CLIP_DIR/models"

echo "📥 Downloading CLIP model: $CLIP_MODEL_NAME..."

# Ensure model directory exists
mkdir -p "$MODEL_DIR"

cd "$MODEL_DIR"
if [ ! -f "$CLIP_MODEL_NAME" ]; then
  curl -L -o "$CLIP_MODEL_NAME" https://huggingface.co/monatis/clip-vit-base-patch32-gguf/resolve/main/$CLIP_MODEL_NAME
  echo "✅ Model downloaded to $MODEL_DIR"
else
  echo "Model $CLIP_MODEL_NAME already exists."
fi
