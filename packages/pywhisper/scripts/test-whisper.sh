#!/usr/bin/env zsh

curl \
  --silent \
  --show-error \
  --request POST http://localhost:7861/audio/transcribe \
  --form "audio=@$HOME/Downloads/sample_pet.wav" \
| jq
