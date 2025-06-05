#!/usr/bin/env zsh

set -euo pipefail

print_usage() {
  echo "Usage: ${0:t} <path-to-audio-file>"
  echo
  echo "Transcribes the given audio file using whisper-cli."
  echo
  echo "Arguments:"
  echo "  <path-to-audio-file>  Path to the audio file to transcribe"
  exit 1
}

# Validate argument count
if [[ $# -ne 1 ]]; then
  print_usage
fi

file_path=$1

# Ensure file exists and is a regular file
if [[ ! -f "$file_path" ]]; then
  echo "Error: File not found or not a regular file: $file_path" >&2
  exit 2
fi

WHISPER_BIN=~/repos/clones/whisper.cpp/build/bin/whisper-cli
MODEL_PATH=~/repos/clones/whisper.cpp/models/ggml-tiny.en.bin

# Check if whisper-cli binary exists
if [[ ! -x "$WHISPER_BIN" ]]; then
  echo "Error: whisper-cli binary not found or not executable: $WHISPER_BIN" >&2
  exit 3
fi

# Check if model file exists
if [[ ! -f "$MODEL_PATH" ]]; then
  echo "Error: Whisper model file not found: $MODEL_PATH" >&2
  exit 4
fi

# Run whisper-cli
"$WHISPER_BIN" -m "$MODEL_PATH" -f "$file_path" -otxt
