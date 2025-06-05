#!/usr/bin/env zsh

set -euo pipefail

script_dir=${0:A:h}

echo "🔧 Setting up llama.cpp (Mistral)..."

"$script_dir/build.sh"
"$script_dir/download-model.sh"

echo "🎉 llama.cpp setup completed successfully."
