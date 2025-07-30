#!/usr/bin/env zsh

set -euo pipefail

MODELS_DIR="./models"

echo "🔧 Downloading LLM models for Docker service..."

# Create models directory
mkdir -p "$MODELS_DIR"

# Function to download a model
download_model() {
    local model_name="$1"
    local model_dir="$2"
    local model_file="$3"
    local url="$4"
    
    echo "📥 Downloading $model_name model..."
    mkdir -p "$MODELS_DIR/$model_dir"
    
    if [ ! -f "$MODELS_DIR/$model_dir/$model_file" ]; then
        echo "Downloading $model_file..."
        curl -L -o "$MODELS_DIR/$model_dir/$model_file" "$url"
        echo "✅ $model_name downloaded successfully"
    else
        echo "✅ $model_name already exists"
    fi
}

# Download Zephyr model
download_model "Zephyr" \
    "zephyr" \
    "zephyr-7b-beta.Q4_K_M.gguf" \
    "https://huggingface.co/TheBloke/zephyr-7B-beta-GGUF/resolve/main/zephyr-7b-beta.Q4_K_M.gguf"

# Download Mistral model
download_model "Mistral" \
    "mistral" \
    "mistral-7b-instruct-v0.2.Q4_K_M.gguf" \
    "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf"

# Download TinyLlama model
download_model "TinyLlama" \
    "tiny" \
    "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf" \
    "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"

echo "🎉 All models downloaded successfully!"
echo ""
echo "Model locations:"
echo "  Zephyr: $MODELS_DIR/zephyr/zephyr-7b-beta.Q4_K_M.gguf"
echo "  Mistral: $MODELS_DIR/mistral/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
echo "  TinyLlama: $MODELS_DIR/tiny/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf" 