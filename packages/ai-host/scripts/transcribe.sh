#!/usr/bin/env zsh

set -euo pipefail

print_usage() {
  echo "Usage: ${0:t} <path-to-audio-file>"
  echo
  echo "Transcribes the given audio file using the local server endpoint."
  echo
  echo "Arguments:"
  echo "  <path-to-audio-file>  Path to the audio file to transcribe"
  exit 1
}

# Show help if no argument or more than one
if [[ $# -ne 1 ]]; then
  print_usage
fi

file_path=$1

# Ensure file exists and is a regular file
if [[ ! -f "$file_path" ]]; then
  echo "Error: File not found or not a regular file: $file_path" >&2
  exit 2
fi

# Perform transcription
curl -sSf -X POST http://localhost:8787/v1/audio/transcriptions \
  -H "Content-Type: multipart/form-data" \
  -F "file=@${file_path}"
