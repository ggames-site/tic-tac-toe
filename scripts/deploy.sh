#!/usr/bin/env bash

set -Eeuo pipefail

readonly IMAGE="ggames-tic-tac-toe:latest"
readonly GITHUB_REPOSITORY="ggames-site/tic-tac-toe"
readonly CONTAINER_NAME="ggames-tic-tac-toe"
readonly CONTAINER_PORT="80"
readonly DEFAULT_BIND_ADDRESS="0.0.0.0"
readonly DEFAULT_HOST_PORT="8080"

log() {
  printf '[tic-tac-toe] %s\n' "$1"
}

fail() {
  printf '[tic-tac-toe] Error: %s\n' "$1" >&2
  exit 1
}

docker_installed() {
  command -v docker >/dev/null 2>&1
}

detect_architecture() {
  case "$(uname -m)" in
    x86_64|amd64)
      printf 'amd64\n'
      ;;
    aarch64|arm64)
      printf 'arm64\n'
      ;;
    *)
      fail "Unsupported CPU architecture: $(uname -m)."
      ;;
  esac
}

download_release_image() {
  local architecture asset_name checksums_url image_url temporary_directory image_archive checksums_file

  architecture="$(detect_architecture)"
  asset_name="${CONTAINER_NAME}-linux-${architecture}.tar.gz"
  temporary_directory="$(mktemp -d)"
  image_archive="${temporary_directory}/${asset_name}"
  checksums_file="${temporary_directory}/SHA256SUMS"

  if [[ -n "${RELEASE_TAG:-}" ]]; then
    image_url="https://github.com/${GITHUB_REPOSITORY}/releases/download/${RELEASE_TAG}/${asset_name}"
    checksums_url="https://github.com/${GITHUB_REPOSITORY}/releases/download/${RELEASE_TAG}/SHA256SUMS"
  else
    image_url="https://github.com/${GITHUB_REPOSITORY}/releases/latest/download/${asset_name}"
    checksums_url="https://github.com/${GITHUB_REPOSITORY}/releases/latest/download/SHA256SUMS"
  fi

  trap 'rm -rf "${temporary_directory}"' RETURN

  log "Downloading ${asset_name} from GitHub Releases"
  curl -fsSL --retry 3 --retry-delay 2 --output "${image_archive}" "${image_url}"
  curl -fsSL --retry 3 --retry-delay 2 --output "${checksums_file}" "${checksums_url}"

  if ! (
    cd "${temporary_directory}"
    grep -F "  ${asset_name}" "${checksums_file}" | sha256sum --check --status -
  ); then
    fail "The downloaded image archive did not match its SHA-256 checksum."
  fi

  log "Loading ${IMAGE} into Docker"
  docker load --input "${image_archive}" >/dev/null
}

read_existing_network_settings() {
  local published_port

  published_port="$(docker inspect --format '{{with index .HostConfig.PortBindings "80/tcp"}}{{with index . 0}}{{.HostIp}}|{{.HostPort}}{{end}}{{end}}' "${CONTAINER_NAME}")"

  if [[ -z "${published_port}" || "${published_port}" != *"|"* ]]; then
    fail "Existing ${CONTAINER_NAME} container does not publish port ${CONTAINER_PORT}."
  fi

  IFS='|' read -r BIND_ADDRESS HOST_PORT <<< "${published_port}"
  BIND_ADDRESS="${BIND_ADDRESS:-${DEFAULT_BIND_ADDRESS}}"
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

if ! docker_installed; then
  log "Installing Docker Engine"
  apt-get update
  apt-get install -y --no-install-recommends ca-certificates curl

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  architecture="$(dpkg --print-architecture)"
  ubuntu_suite="${UBUNTU_CODENAME:-${VERSION_CODENAME}}"
  printf '%s\n' \
    "Types: deb" \
    "URIs: https://download.docker.com/linux/ubuntu" \
    "Suites: ${ubuntu_suite}" \
    "Components: stable" \
    "Architectures: ${architecture}" \
    "Signed-By: /etc/apt/keyrings/docker.asc" \
    > /etc/apt/sources.list.d/docker.sources

  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io
fi

if ! docker_installed; then
  fail "Docker is unavailable after installation."
fi

systemctl enable --now docker

if ! docker info >/dev/null 2>&1; then
  fail "Docker is installed, but the Docker daemon is not available."
fi

if docker container inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
  log "Existing container found; preserving its network settings"
  read_existing_network_settings
  container_exists=true
else
  container_exists=false

  if [[ -t 0 ]]; then
    read -r -p "Bind address [${DEFAULT_BIND_ADDRESS}]: " BIND_ADDRESS
    read -r -p "External port [${DEFAULT_HOST_PORT}]: " HOST_PORT
  else
    BIND_ADDRESS=""
    HOST_PORT=""
  fi

  BIND_ADDRESS="${BIND_ADDRESS:-${DEFAULT_BIND_ADDRESS}}"
  HOST_PORT="${HOST_PORT:-${DEFAULT_HOST_PORT}}"
fi

if [[ ! "${HOST_PORT}" =~ ^[0-9]+$ ]] || (( HOST_PORT < 1 || HOST_PORT > 65535 )); then
  fail "Port must be an integer between 1 and 65535."
fi

download_release_image

if [[ "${container_exists}" == true ]]; then
  log "Replacing the existing container"
  docker rm --force "${CONTAINER_NAME}" >/dev/null
fi

log "Starting ${CONTAINER_NAME}"
docker run --detach \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  --publish "${BIND_ADDRESS}:${HOST_PORT}:${CONTAINER_PORT}" \
  "${IMAGE}" >/dev/null

log "Waiting for the container health check"
for _ in {1..30}; do
  status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${CONTAINER_NAME}")"

  if [[ "${status}" == "healthy" ]]; then
    public_address="${BIND_ADDRESS}"
    [[ "${public_address}" == "0.0.0.0" ]] && public_address="<server-ip>"
    log "Ready: http://${public_address}:${HOST_PORT}"
    exit 0
  fi

  if [[ "${status}" == "unhealthy" || "${status}" == "exited" || "${status}" == "dead" ]]; then
    docker logs --tail 100 "${CONTAINER_NAME}" >&2 || true
    fail "Container entered the ${status} state."
  fi

  sleep 2
done

docker logs --tail 100 "${CONTAINER_NAME}" >&2 || true
fail "Container did not become healthy in time."
