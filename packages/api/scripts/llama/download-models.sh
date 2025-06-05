#!/usr/bin/env zsh

set -euo pipefail

REPO_DIR=~/repos/clones
LLAMA_DIR="$REPO_DIR/llama.cpp"


# region | Mistral model download
echo "🔧 Downloading Mistral model..."

MISTRAL_URL="https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF"
MISTRAL_MODEL_DIR="$LLAMA_DIR/models/mistral"
MISTRAL_MODEL_NAME="mistral-7b-instruct-v0.1.Q4_K_M.gguf"

mkdir -p "$MISTRAL_MODEL_DIR"

if [ ! -f "$MISTRAL_MODEL_DIR/$MISTRAL_MODEL_NAME" ]; then
  echo "Downloading $MISTRAL_MODEL_NAME..."
  curl -L -o "$MISTRAL_MODEL_DIR/$MISTRAL_MODEL_NAME" \
    "$MISTRAL_URL/resolve/main/$MISTRAL_MODEL_NAME"
else
  echo "Model $MISTRAL_MODEL_NAME already exists."
fi
# endregion | Mistral model download

# region | Zephyr model download
ZEPHYR_URL="https://huggingface.co/TheBloke/zephyr-7B-beta-GGUF"
ZEPHYR_MODEL_DIR="$LLAMA_DIR/models/zephyr"
ZEPHYR_MODEL_NAME="zephyr-7b-beta.Q4_K_M.gguf"

echo "🔧 Downloading Zephyr model..."
mkdir -p "$ZEPHYR_MODEL_DIR"

if [ ! -f "$ZEPHYR_MODEL_DIR/$ZEPHYR_MODEL_NAME" ]; then
  echo "Downloading $ZEPHYR_MODEL_NAME..."
  curl -L -o "$ZEPHYR_MODEL_DIR/$ZEPHYR_MODEL_NAME" \
    "$ZEPHYR_URL/resolve/main/$ZEPHYR_MODEL_NAME"
else
  echo "Model $ZEPHYR_MODEL_NAME already exists."
fi
# endregion | Zephyr model download

echo "✅ Download complete."

