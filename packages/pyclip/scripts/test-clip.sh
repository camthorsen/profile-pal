#!/usr/bin/env zsh

curl \
  --silent \
  --show-error \
  --request POST http://localhost:7860/tag \
  --form "file=@$HOME/Downloads/cat.jpg" \
| jq
