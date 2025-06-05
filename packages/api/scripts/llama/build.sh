#!/usr/bin/env zsh

set -euo pipefail

REPO_DIR=~/repos/clones
LLAMA_DIR="$REPO_DIR/llama.cpp"
BUILD_DIR="$LLAMA_DIR/build"

echo "🔧 Building llama.cpp (via CMake)..."

mkdir -p "$REPO_DIR"

if [ ! -d "$LLAMA_DIR" ]; then
  echo "Cloning llama.cpp into $LLAMA_DIR..."
  git clone https://github.com/ggerganov/llama.cpp.git "$LLAMA_DIR"
else
  echo "llama.cpp already cloned."
fi

echo "Building with CMake..."

mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"
cmake .. -DLLAMA_BUILD_EXAMPLES=ON
cmake --build . --config Release

echo "✅ llama.cpp CMake build complete."
