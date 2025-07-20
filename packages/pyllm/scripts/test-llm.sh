#!/usr/bin/env zsh

set -euo pipefail

# Function to time and execute a command
time_step() {
    local step_name="$1"
    local start_time=$(date +%s.%N)

    echo "$step_name..."

    # Execute the command (shift removes the first argument, leaving the actual command)
    shift
    "$@"

    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc -l)
    echo "⏱️  $step_name completed in ${duration}s"
    echo ""
}

echo "🧪 Testing LLM service..."

# Test 1: Health check
time_step "1. Testing health check" bash -c '
if curl -s http://localhost:7862/ > /dev/null; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi'

# Test 2: List models
time_step "2. Testing model listing" bash -c '
if curl -s http://localhost:7862/models > /dev/null; then
    echo "✅ Model listing works"
else
    echo "❌ Model listing failed"
    exit 1
fi'

# Test 3: Generate text with tiny
#time_step "3. Testing text generation with tiny" bash -c '
#response=$(curl -s -X POST http://localhost:7862/generate \
#  -H "Content-Type: application/json" \
#  -d "{\"prompt\": \"Hello, how are you?\", \"model\": \"tiny\", \"max_tokens\": 30}")
#
#if echo "$response" | grep -q "text"; then
#    echo "✅ Text generation works"
#    echo "Response: $response"
#else
#    echo "❌ Text generation failed"
#    echo "Response: $response"
#    exit 1
#fi'

# Test 4: Test summarize endpoint
time_step "4. Testing summarize endpoint" bash -c '
response=$(curl -s -X POST http://localhost:7862/summarize \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"This is Daisy the cat. She is, uh, fluffy and friendly.\", \"model\": \"tiny\"}")

if echo "$response" | grep -q "text"; then
    echo "✅ Summarize endpoint works"
    echo "Response: $response"
else
    echo "❌ Summarize endpoint failed"
    echo "Response: $response"
    exit 1
fi'

echo "🎉 All tests passed! The LLM service is working correctly."
