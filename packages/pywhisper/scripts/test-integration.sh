#!/usr/bin/env zsh

set -euo pipefail

echo "Testing Docker Whisper service integration..."

# Test 1: Check if service is running
echo "1. Checking if Whisper service is running..."
if curl -s http://localhost:7861/docs > /dev/null; then
    echo "Whisper service is running on port 7861"
else
    echo "Whisper service is NOT accessible on port 7861"
    exit 1
fi

# Test 2: Check if the API endpoint exists
echo "2. Checking API endpoint..."
if curl -s http://localhost:7861/openapi.json > /dev/null; then
    echo "API endpoint is accessible"
else
    echo "API endpoint is NOT accessible"
    exit 1
fi

echo "🎉 Integration test passed! The Docker Whisper service is ready to use."
echo ""
echo "Next steps:"
echo "1. Start your NextJS application"
echo "2. Upload an image and audio file"
echo "3. The transcribed text should now appear above the Profile Summary" 