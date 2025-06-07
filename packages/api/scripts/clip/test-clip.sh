#!/usr/bin/env zsh

set -euo pipefail

#$HOME/repos/clones/clip.cpp/build/bin/main --help


$HOME/repos/clones/clip.cpp/build/bin/main \
  -m "$HOME/repos/clones/clip.cpp/models/clip-vit-base-patch32.gguf" \
  --image "$HOME/Downloads/cat.jpg" \
  --text "cat" --text "dog" --text "rabbit" --text "other"
