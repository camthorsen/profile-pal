#!/usr/bin/env zsh

set -euo pipefail

script_dir=${0:A:h}

echo "🔧 Setting up clip.cpp..."

"$script_dir/build.sh"
"$script_dir/download-model.sh"

echo "🎉 CLIP setup completed successfully."
