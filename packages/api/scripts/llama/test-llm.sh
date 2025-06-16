#!/usr/bin/env zsh

set -euo pipefail

REPO_DIR=~/repos/clones
LLAMA_DIR="$REPO_DIR/llama.cpp"
MODEL_NAME=zephyr/zephyr-7b-beta.Q4_K_M.gguf

echo "Repository directory: $REPO_DIR"
echo "Llama.cpp directory: $LLAMA_DIR"
echo "Model name: $MODEL_NAME"

$LLAMA_DIR/build/bin/llama-simple \
  -m $LLAMA_DIR/models/$MODEL_NAME \
  -p "As experienced marketer, refine the following text: This is Garfield. He's ten years old. We rescued him from a hoarding situation in Toronto and he has diabetes. He's usually pretty good with other cats and he is probably okay with dogs and children."
