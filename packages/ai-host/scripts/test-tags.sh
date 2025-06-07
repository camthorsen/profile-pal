#!/usr/bin/env zsh

set -euo pipefail

print_usage() {
  echo "Usage: ${0:t} <image-file>"
  echo
  echo "Sends image to /api/image/tags for label classification."
  echo
  echo "Arguments:"
  echo "  <image-file>  Path to the image file to classify"
  exit 1
}

if [[ $# -ne 1 ]]; then
  print_usage
fi

image_path=$1

if [[ ! -f "$image_path" ]]; then
  echo "Error: File not found: $image_path" >&2
  exit 2
fi

curl -sSf -X POST http://localhost:8787/api/image/tags \
  -F "image=@${image_path}" | jq
