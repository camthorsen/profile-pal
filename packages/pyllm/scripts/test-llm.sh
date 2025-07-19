#!/usr/bin/env zsh

set -euo pipefail

echo "🧪 Testing LLM service..."

# Test 1: Health check
echo "1. Testing health check..."
if curl -s http://localhost:7862/ > /dev/null; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi

# Test 2: List models
echo "2. Testing model listing..."
if curl -s http://localhost:7862/models > /dev/null; then
    echo "✅ Model listing works"
else
    echo "❌ Model listing failed"
    exit 1
fi

# Test 3: Generate text with Zephyr
echo "3. Testing text generation with Zephyr..."
response=$(curl -s -X POST http://localhost:7862/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?", "model": "zephyr", "max_tokens": 30}')

if echo "$response" | grep -q "text"; then
    echo "✅ Text generation works"
    echo "Response: $response"
else
    echo "❌ Text generation failed"
    echo "Response: $response"
    exit 1
fi

# Test 4: Test summarize endpoint
echo "4. Testing summarize endpoint..."
response=$(curl -s -X POST http://localhost:7862/summarize \
  -H "Content-Type: application/json" \
  -d '{"prompt": "This is a cat. It is fluffy and friendly.", "model": "zephyr"}')

if echo "$response" | grep -q "text"; then
    echo "✅ Summarize endpoint works"
    echo "Response: $response"
else
    echo "❌ Summarize endpoint failed"
    echo "Response: $response"
    exit 1
fi

echo "🎉 All tests passed! The LLM service is working correctly."
