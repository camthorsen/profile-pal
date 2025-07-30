#!/usr/bin/env zsh
source "$(dirname "$0")/config.sh"

# Build the concurrently command array
cmds=()
names=()
colors=(blue magenta green yellow cyan)
color_index=0

# ai-host
cmds+=("pnpm run --filter ./packages/ai-host dev")
names+=("ai-host")
# nextjs
cmds+=("pnpm run --filter ./packages/nextjs dev")
names+=("nextjs")

# Docker Compose services
for service in "${DOCKER_SERVICES[@]}"; do
  compose_file="./packages/$service/docker-compose.yaml"
  cmds+=("docker compose --file '$compose_file' up")
  names+=("$service")
  color_index=$((color_index+1))
done

# Join names and colors for concurrently
name_str=$(IFS=,; echo "${names[*]}")
color_str=$(IFS=,; echo "${colors[*]}")

# Run all commands in parallel with concurrently
pnpm exec concurrently \
  --names "$name_str" \
  --prefix-colors "$color_str" \
  "${cmds[@]}"
