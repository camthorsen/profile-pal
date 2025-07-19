#!/usr/bin/env zsh

curl \
  --silent \
  --show-error \
  --request POST http://localhost:7861/transcribe \
  --form "file=@$HOME/Downloads/sample_pet.wav" \
| jq
