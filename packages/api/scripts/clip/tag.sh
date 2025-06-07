#!/usr/bin/env zsh

set -euo pipefail

print_usage() {
  echo "Usage: ${0:t} <path-to-image-file>"
  echo
  echo "Classifies the given image file into animal type using clip.cpp."
  echo
  echo "Arguments:"
  echo "  <path-to-image-file>  Path to the image file to classify"
  exit 1
}

# Validate input
if [[ $# -ne 1 ]]; then
  print_usage
fi

image_path=$1

if [[ ! -f "$image_path" ]]; then
  echo "Error: File not found: $image_path" >&2
  exit 2
fi

CLIP_BIN="$HOME/repos/clones/clip.cpp/build/bin/main"
MODEL_PATH="$HOME/repos/clones/clip.cpp/models/clip-vit-base-patch32.gguf"

if [[ ! -x "$CLIP_BIN" ]]; then
  echo "Error: clip binary not found or not executable: $CLIP_BIN" >&2
  exit 3
fi

if [[ ! -f "$MODEL_PATH" ]]; then
  echo "Error: model file not found: $MODEL_PATH" >&2
  exit 4
fi

type_labels=("cat" "dog" "rabbit" "other")

best_label=""
best_score="-1000"

for label in "${type_labels[@]}"; do
  # FIXME: Hardcoded labels
  output=$("$CLIP_BIN" --image "$image_path" --text "cat" --text "dog" --text "rabbit" --text "other" -m "$MODEL_PATH")
  score=$(echo "$output" | grep "Similarity score" | awk '{ print $NF }')

  comparison=$(echo "$score > $best_score" | bc -l | tr -d '\n')
  if [[ "$comparison" == "1" ]]; then
    best_score="$score"
    best_label="$label"
  fi
done

# Output just the top result
echo "$best_label"
