#!/usr/bin/env zsh

set -euo pipefail

print_usage() {
  echo "Usage: ${0:t} <image-file> <audio-file>"
  echo
  echo "Sends image and audio to /api/process-profile for tagging and transcription."
  echo
  echo "Arguments:"
  echo "  <image-file>  Path to the image of the animal"
  echo "  <audio-file>  Path to the audio description"
  exit 1
}

if [[ $# -ne 2 ]]; then
  print_usage
fi

image_path=$1
audio_path=$2

if [[ ! -f "$image_path" ]]; then
  echo "Error: Image file not found: $image_path" >&2
  exit 2
fi

if [[ ! -f "$audio_path" ]]; then
  echo "Error: Audio file not found: $audio_path" >&2
  exit 3
fi

# Perform the request
curl -sSf -X POST http://localhost:8787/api/process-profile \
  -F "image=@${image_path}" \
  -F "audio=@${audio_path}" | jq
