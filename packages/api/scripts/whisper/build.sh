#!/usr/bin/env zsh

set -euo pipefail

REPO_DIR=~/repos/clones
WHISPER_DIR="$REPO_DIR/whisper.cpp"
MODEL_NAME=ggml-tiny.en.bin

echo "🔧 Building whisper.cpp..."

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

echo "✅ whisper.cpp build complete."
