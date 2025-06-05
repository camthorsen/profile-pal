#!/usr/bin/env zsh

set -euo pipefail

REPO_DIR=~/repos/clones
LLAMA_DIR="$REPO_DIR/llama.cpp"
MODEL_NAME=mistral/mistral-7b-instruct-v0.1.Q4_K_M.gguf

echo "Repository directory: $REPO_DIR"
echo "Llama.cpp directory: $LLAMA_DIR"
echo "Model name: $MODEL_NAME"

$LLAMA_DIR/build/bin/llama-simple \
  -m $LLAMA_DIR/models/$MODEL_NAME \
  -p "What is the capital of France?"
