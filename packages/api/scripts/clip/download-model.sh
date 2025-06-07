#!/usr/bin/env zsh
set -euo pipefail

CLIP_MODEL_INPUT_NAME=clip-vit-base-patch32_ggml-model-f16.gguf
CLIP_MODEL_OUTPUT_NAME=clip-vit-base-patch32.gguf
CLIP_DIR=~/repos/clones/clip.cpp
MODEL_DIR="$CLIP_DIR/models"

echo "📥 Downloading CLIP model: $CLIP_MODEL_INPUT_NAME..."

# Ensure model directory exists
mkdir -p "$MODEL_DIR"

cd "$MODEL_DIR"
if [ ! -f "$CLIP_MODEL_OUTPUT_NAME" ]; then
  curl -L -o "$CLIP_MODEL_OUTPUT_NAME" "https://huggingface.co/mys/ggml_clip-vit-base-patch32/resolve/main/$CLIP_MODEL_INPUT_NAME"
  echo "✅ Model downloaded to $MODEL_DIR"
else
  echo "Model $CLIP_MODEL_INPUT_NAME already exists."
fi

