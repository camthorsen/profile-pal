#!/usr/bin/env zsh
source "$(dirname "$0")/config.sh"

# Stop ai-host dev server if running (assume port $AI_HOST_PORT)
ai_host_pids=$(lsof -ti :"$AI_HOST_PORT")
if [[ -n "$ai_host_pids" ]]; then
  echo "Stopping ai-host processes..."
  echo "$ai_host_pids" | while read -r pid; do
    if [[ -n "$pid" ]]; then
      echo "  Stopping ai-host (PID: $pid)"
      kill "$pid"
    fi
  done
fi

# Stop Next.js dev server if running (assume port $NEXTJS_PORT)
nextjs_pids=$(lsof -ti :"$NEXTJS_PORT")
if [[ -n "$nextjs_pids" ]]; then
  echo "Stopping Next.js processes..."
  echo "$nextjs_pids" | while read -r pid; do
    if [[ -n "$pid" ]]; then
      echo "  Stopping Next.js (PID: $pid)"
      kill "$pid"
    fi
  done
fi

# Stop Docker Compose services
echo "Stopping Docker Compose services..."
for service in "${DOCKER_SERVICES[@]}"; do
  compose_file="./packages/$service/docker-compose.yaml"
  if docker compose --file "$compose_file" ps | grep -q "Up"; then
    docker compose --file "$compose_file" down
  fi
done

echo "All services stopped."
