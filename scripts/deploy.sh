#!/usr/bin/env bash

set -Eeuo pipefail

readonly IMAGE="ghcr.io/ggames-site/tic-tac-toe"
readonly TAG="latest"
readonly CONTAINER_NAME="ggames-tic-tac-toe"
readonly DEFAULT_BIND_ADDRESS="0.0.0.0"
readonly DEFAULT_HOST_PORT="8080"

log() {
  printf '[tic-tac-toe] %s\n' "$1"
}

fail() {
  printf '[tic-tac-toe] Error: %s\n' "$1" >&2
  exit 1
}

docker_dependencies_installed() {
  command -v docker >/dev/null 2>&1 \
    && docker buildx version >/dev/null 2>&1 \
    && docker compose version >/dev/null 2>&1
}

read_existing_network_settings() {
  local published_port

  published_port="$(docker inspect --format '{{with index .HostConfig.PortBindings "80/tcp"}}{{with index . 0}}{{.HostIp}}|{{.HostPort}}{{end}}{{end}}' "${CONTAINER_NAME}")"

  if [[ -z "${published_port}" || "${published_port}" != *"|"* ]]; then
    fail "Existing ${CONTAINER_NAME} container does not publish port 80; unable to preserve its network settings."
  fi

  IFS='|' read -r BIND_ADDRESS HOST_PORT <<< "${published_port}"
  BIND_ADDRESS="${BIND_ADDRESS:-${DEFAULT_BIND_ADDRESS}}"

  if [[ ! "${HOST_PORT}" =~ ^[0-9]+$ ]] || (( HOST_PORT < 1 || HOST_PORT > 65535 )); then
    fail "Existing ${CONTAINER_NAME} container has an invalid published port."
  fi
}

print_summary() {
  local public_address="${BIND_ADDRESS}"
  local access_url
  local green=""
  local cyan=""
  local bold=""
  local reset=""

  if [[ "${BIND_ADDRESS}" == "0.0.0.0" ]]; then
    public_address="<server-ip>"
  fi

  access_url="http://${public_address}:${HOST_PORT}"

  if [[ -t 1 ]]; then
    green=$'\033[32m'
    cyan=$'\033[36m'
    bold=$'\033[1m'
    reset=$'\033[0m'
  fi

  printf '\n'
  printf '%s\n' "${green}+------------------------------------------------------------+${reset}"
  printf '%s\n' "${green}|            GGames Tic-Tac-Toe is ready to use              |${reset}"
  printf '%s\n' "${green}+------------------------------------------------------------+${reset}"
  printf '\n'
  printf '  %s%-18s%s %s\n' "${bold}" "Status:" "${reset}" "${green}healthy${reset}"
  printf '  %s%-18s%s %s\n' "${bold}" "Application URL:" "${reset}" "${cyan}${access_url}${reset}"
  printf '  %s%-18s%s %s\n' "${bold}" "Bind address:" "${reset}" "${BIND_ADDRESS}"
  printf '  %s%-18s%s %s\n' "${bold}" "External port:" "${reset}" "${HOST_PORT}"
  printf '  %s%-18s%s %s\n' "${bold}" "Container:" "${reset}" "${CONTAINER_NAME}"
  printf '  %s%-18s%s %s\n' "${bold}" "Docker image:" "${reset}" "${FULL_IMAGE}"
  printf '  %s%-18s%s %s\n' "${bold}" "Restart policy:" "${reset}" "unless-stopped"
  printf '\n'
  printf '  %sUseful commands%s\n' "${bold}" "${reset}"
  printf '  %-18s %s\n' "View status:" "sudo docker ps --filter name=${CONTAINER_NAME}"
  printf '  %-18s %s\n' "Follow logs:" "sudo docker logs -f ${CONTAINER_NAME}"
  printf '  %-18s %s\n' "Restart:" "sudo docker restart ${CONTAINER_NAME}"
  printf '  %-18s %s\n' "Stop:" "sudo docker stop ${CONTAINER_NAME}"
  printf '  %-18s %s\n' "Update:" "sudo bash scripts/deploy.sh"
  printf '\n'

  if [[ "${BIND_ADDRESS}" == "0.0.0.0" ]]; then
    printf '  %sNote:%s Replace <server-ip> with the public IP address or domain name.\n' \
      "${cyan}" "${reset}"
    printf '\n'
  fi
}

if [[ "${EUID}" -ne 0 ]]; then
  fail "Run this script as root, for example: sudo bash scripts/deploy.sh"
fi

if (( $# > 0 )); then
  fail "This script does not accept arguments."
fi

if [[ ! -r /etc/os-release ]]; then
  fail "Unable to determine the operating system."
fi

# shellcheck disable=SC1091
source /etc/os-release

if [[ "${ID:-}" != "ubuntu" ]]; then
  fail "This deployment script supports Ubuntu only."
fi

export DEBIAN_FRONTEND=noninteractive

if docker_dependencies_installed; then
  log "Docker, Buildx, and Compose are already installed; skipping package installation"
else
  log "Installing Docker and required plugins"
  apt-get update
  apt-get install -y --no-install-recommends ca-certificates curl

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  ARCHITECTURE="$(dpkg --print-architecture)"
  UBUNTU_SUITE="${UBUNTU_CODENAME:-${VERSION_CODENAME}}"
  printf '%s\n' \
    "Types: deb" \
    "URIs: https://download.docker.com/linux/ubuntu" \
    "Suites: ${UBUNTU_SUITE}" \
    "Components: stable" \
    "Architectures: ${ARCHITECTURE}" \
    "Signed-By: /etc/apt/keyrings/docker.asc" \
    > /etc/apt/sources.list.d/docker.sources

  apt-get update
  apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
fi

if ! docker_dependencies_installed; then
  fail "Docker or one of the required CLI plugins is unavailable after installation."
fi

if systemctl list-unit-files --type=service --no-legend \
  | grep -q '^docker\.service'; then
  systemctl enable --now docker
fi

if ! docker info >/dev/null 2>&1; then
  fail "Docker is installed, but the Docker daemon is not available."
fi

if docker container inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
  log "Existing ${CONTAINER_NAME} container found; preserving its network settings"
  read_existing_network_settings
  CONTAINER_EXISTS=true
else
  CONTAINER_EXISTS=false

  if [[ -t 0 ]]; then
    read -r -p "Bind address [${DEFAULT_BIND_ADDRESS}]: " BIND_ADDRESS
    read -r -p "External port [${DEFAULT_HOST_PORT}]: " HOST_PORT
  else
    log "No interactive terminal detected, using default network settings"
    BIND_ADDRESS=""
    HOST_PORT=""
  fi

  BIND_ADDRESS="${BIND_ADDRESS:-${DEFAULT_BIND_ADDRESS}}"
  HOST_PORT="${HOST_PORT:-${DEFAULT_HOST_PORT}}"

  if [[ ! "${HOST_PORT}" =~ ^[0-9]+$ ]] || (( HOST_PORT < 1 || HOST_PORT > 65535 )); then
    fail "Port must be an integer between 1 and 65535."
  fi
fi

if [[ -n "${GHCR_TOKEN:-}" ]]; then
  log "Authenticating with GitHub Container Registry"
  printf '%s' "${GHCR_TOKEN}" | docker login ghcr.io \
    --username "ggames-site" \
    --password-stdin
fi

FULL_IMAGE="${IMAGE}:${TAG}"

log "Pulling ${FULL_IMAGE}"
docker pull "${FULL_IMAGE}"

if [[ "${CONTAINER_EXISTS}" == true ]]; then
  log "Replacing the existing ${CONTAINER_NAME} container"
  docker rm --force "${CONTAINER_NAME}" >/dev/null
fi

log "Starting ${CONTAINER_NAME}"
docker run --detach \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  --publish "${BIND_ADDRESS}:${HOST_PORT}:80" \
  --env NODE_ENV=production \
  "${FULL_IMAGE}" >/dev/null

log "Waiting for the container health check"
for _ in {1..30}; do
  STATUS="$(docker inspect \
    --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    "${CONTAINER_NAME}")"

  if [[ "${STATUS}" == "healthy" ]]; then
    print_summary
    exit 0
  fi

  if [[ "${STATUS}" == "unhealthy" || "${STATUS}" == "exited" || "${STATUS}" == "dead" ]]; then
    docker logs --tail 100 "${CONTAINER_NAME}" >&2 || true
    fail "Container entered the ${STATUS} state."
  fi

  sleep 2
done

docker logs --tail 100 "${CONTAINER_NAME}" >&2 || true
fail "Container did not become healthy in time."
