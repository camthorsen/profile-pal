#!/usr/bin/env zsh
source "$(dirname "$0")/config.sh"

# Start ai-host if not running (assume port $AI_HOST_PORT)
if ! lsof -i:"$AI_HOST_PORT" > /dev/null; then
  pnpm run --filter ./packages/ai-host dev &
fi

# Start Next.js if not running (assume port $NEXTJS_PORT)
if ! lsof -i:"$NEXTJS_PORT" > /dev/null; then
  pnpm run --filter ./packages/nextjs dev &
fi

# Start Docker Compose services in detached mode if not running
for service in "${DOCKER_SERVICES[@]}"; do
  compose_file="./packages/$service/docker-compose.yaml"
  if ! docker compose --file "$compose_file" ps | grep -q "Up"; then
    docker compose --file "$compose_file" up --detach
  fi
done

wait
