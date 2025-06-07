#!/usr/bin/env zsh

set -euo pipefail

print_usage() {
  echo "Usage: ${0:t} <path-to-image-file>"
  echo
  echo "Classifies the given image file into animal type, coat length, and breed using clip-classify."
  echo
  echo "Arguments:"
  echo "  <path-to-image-file>  Path to the image file to classify"
  exit 1
}

# Validate argument count
if [[ $# -ne 1 ]]; then
  print_usage
fi

image_path=$1

# Ensure file exists
if [[ ! -f "$image_path" ]]; then
  echo "Error: File not found: $image_path" >&2
  exit 2
fi

CLIP_BIN="$HOME/repos/clones/clip.cpp/build/bin/main"
MODEL_PATH="$HOME/repos/clones/clip.cpp/models/clip-vit-base-patch32.gguf"

# Check if binary and model exist
if [[ ! -x "$CLIP_BIN" ]]; then
  echo "Error: clip-classify binary not found: $CLIP_BIN" >&2
  exit 3
fi

if [[ ! -f "$MODEL_PATH" ]]; then
  echo "Error: CLIP model file not found: $MODEL_PATH" >&2
  exit 4
fi

echo "📸 Classifying image: $image_path"

# Category 1: Animal type
type_labels=("cat" "dog" "rabbit" "other")
type_result=$("$CLIP_BIN" -m "$MODEL_PATH" -i "$image_path" -t "${(j:,:)type_labels}")
echo "🔹 Type: $type_result"

# Category 2: Coat length
coat_labels=("short fur" "medium fur" "long fur" "hairless")
coat_result=$("$CLIP_BIN" -m "$MODEL_PATH" -i "$image_path" -t "${(j:,:)coat_labels}")
echo "🔹 Coat: $coat_result"

# Category 3: Breed
breed_labels=(
  "domestic shorthair"
  "domestic mediumhair"
  "domestic longhair"
  "mixed"
  "poodle"
  "golden retriever"
  "german shepherd"
  "beagle"
  "bulldog"
  "other"
)
breed_result=$("$CLIP_BIN" -m "$MODEL_PATH" -i "$image_path" -t "${(j:,:)breed_labels}")
echo "🔹 Breed: $breed_result"
