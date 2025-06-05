#!/usr/bin/env zsh

set -euo pipefail

print_usage() {
  echo "Usage: ${0:t} <path-to-text-file>"
  echo
  echo "Improves the text in the file using Mistral's Llama model."
  echo
  echo "Arguments:"
  echo "  <path-to-text-file>  Path to the text file to transcribe"
  exit 1
}

# Validate argument count
if [[ $# -ne 1 ]]; then
  print_usage
fi

file_path=$1

# Ensure file exists and is a regular file
if [[ ! -f "$file_path" ]]; then
  echo "Error: File not found or not a regular file: $file_path" >&2
  exit 2
fi

REPO_DIR=~/repos/clones
LLAMA_DIR="$REPO_DIR/llama.cpp"
LLAMA_BIN="$LLAMA_DIR/build/bin/llama-simple"
MISTRAL_MODEL_DIR_="$LLAMA_DIR/models/mistral"
MISTRAL_MODEL_NAME=mistral-7b-instruct-v0.1.Q4_K_M.gguf

ZEPHYR_MODEL_DIR="$LLAMA_DIR/models/zephyr"
ZEPHYR_MODEL_NAME="zephyr-7b-beta.Q4_K_M.gguf"

MODEL_DIR="$MISTRAL_MODEL_DIR_"
MODEL_NAME="$MISTRAL_MODEL_NAME"

MODEL_PATH="$MODEL_DIR/$MODEL_NAME"

echo "Repository directory: $REPO_DIR"
echo "Llama.cpp directory: $LLAMA_DIR"
echo "Model name: $MODEL_NAME"
echo "Model path: $MODEL_PATH"
echo "File to improve: $file_path"

# Check if Llama binary exists
if [[ ! -x "$LLAMA_BIN" ]]; then
  echo "Error: Llama binary not found or not executable: $LLAMA_BIN" >&2
  exit 3
fi

# Check if model file exists
if [[ ! -f "$MODEL_PATH" ]]; then
  echo "Error: Llama model file not found: $MODEL_PATH" >&2
  exit 4
fi

# Compose the prompt in memory
input_text=$(<"$file_path")
prompt=$'Improve the following text:\n\n'"$input_text"

"$LLAMA_BIN" \
  -m "$MODEL_PATH" \
  -p "$prompt" \
  --n-predict 64
