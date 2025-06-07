#!/usr/bin/env zsh
set -euo pipefail

REPO_DIR=~/repos/clones
CLIP_DIR="$REPO_DIR/clip.cpp"

echo "🔧 Building clip.cpp..."

# Ensure base directory exists
mkdir -p "$REPO_DIR"

# Clone the repo if it doesn't already exist
if [ ! -d "$CLIP_DIR" ]; then
  echo "Cloning clip.cpp into $CLIP_DIR..."
  git clone https://github.com/monatis/clip.cpp.git "$CLIP_DIR"
else
  echo "clip.cpp already cloned."
fi

# Build using CMake
cd "$CLIP_DIR"
git submodule update --init --recursive
cmake -B build -DCMAKE_POLICY_VERSION_MINIMUM=3.5
cmake --build build --config Release

echo "✅ clip.cpp build complete."
