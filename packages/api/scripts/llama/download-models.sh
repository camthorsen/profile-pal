#!/usr/bin/env zsh

set -euo pipefail

REPO_DIR=~/repos/clones
LLAMA_DIR="$REPO_DIR/llama.cpp"

function download_model() {
  local name="$1"
  local url="$2"
  local dir="$3"
  local filename="$4"

  echo "🔧 Downloading ${name} model..."
  mkdir -p "$dir"

  if [ ! -f "$dir/$filename" ]; then
    echo "Downloading $filename..."
    curl -L -o "$dir/$filename" "$url/resolve/main/$filename"
  else
    echo "Model $filename already exists."
  fi
}

download_model "Mistral" \
  "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF" \
  "$LLAMA_DIR/models/mistral" \
  "mistral-7b-instruct-v0.1.Q4_K_M.gguf"

download_model "Tiny" \
  "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF" \
  "$LLAMA_DIR/models/tiny" \
  "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"

download_model "Zephyr" \
  "https://huggingface.co/TheBloke/zephyr-7B-beta-GGUF" \
  "$LLAMA_DIR/models/zephyr" \
  "zephyr-7b-beta.Q4_K_M.gguf"

echo "✅ Download complete."
