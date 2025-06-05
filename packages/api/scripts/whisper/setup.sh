#!/usr/bin/env zsh

set -euo pipefail

script_dir=${0:A:h}

echo "🔧 Setting up whisper.cpp..."

"$script_dir/build.sh"
"$script_dir/download-model.sh"

echo "🎉 Setup completed successfully."
