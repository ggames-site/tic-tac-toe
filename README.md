# GGames — Крестики-нолики

Классическая игра «Крестики-нолики» на React, TypeScript и Vite с русской и английской локализацией.

## Локальная разработка

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Проверки и production-сборка:

```bash
pnpm test
pnpm lint
pnpm build
```

## Docker

Production-образ собирает статические файлы Vite и отдаёт их через Nginx на порту `80`.

```bash
docker build -t ggames-tic-tac-toe:local .
docker run --rm -p 8080:80 ggames-tic-tac-toe:local
```

После запуска приложение доступно по адресу `http://localhost:8080`.

## Публикация образа

Workflow [Build and publish Docker image](./.github/workflows/docker-publish.yml) запускается при отправке Git-тега или вручную из **Actions**. Он собирает образы для `linux/amd64` и `linux/arm64`, публикуя их в GitHub Container Registry:

```text
ghcr.io/ggames-site/tic-tac-toe
```

Для релиза создайте и отправьте тег после того, как workflow уже попадёт в основную ветку:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Будут опубликованы теги версии, сокращённые semver-теги и `latest`. Дополнительные secrets не нужны: workflow использует встроенный `GITHUB_TOKEN`. Чтобы сервер мог скачивать образ без авторизации, сделайте GHCR-пакет публичным в настройках пакета GitHub.

## Развёртывание на Ubuntu

Скрипт [scripts/deploy.sh](./scripts/deploy.sh) установит Docker Engine при необходимости, скачает `ghcr.io/ggames-site/tic-tac-toe:latest` и запустит контейнер с политикой перезапуска `unless-stopped`.

Из клонированного репозитория:

```bash
sudo bash scripts/deploy.sh
```

Или одной командой на сервере без клонирования репозитория:

```bash
curl -fsSL https://raw.githubusercontent.com/ggames-site/tic-tac-toe/main/scripts/deploy.sh | sudo bash
```

При первом запуске можно выбрать адрес привязки и внешний порт; по умолчанию используются `0.0.0.0` и `8080`. Для reverse proxy укажите адрес `127.0.0.1`. При повторном запуске скрипт сохранит текущие сетевые настройки контейнера и обновит образ.

Если GHCR-пакет приватный, создайте GitHub Personal Access Token с правом `read:packages` и передайте его скрипту:

```bash
curl -fsSL https://raw.githubusercontent.com/ggames-site/tic-tac-toe/main/scripts/deploy.sh | \
  sudo env GHCR_TOKEN=YOUR_GITHUB_TOKEN bash
```

## Управление контейнером

```bash
sudo docker ps --filter name=ggames-tic-tac-toe
sudo docker logs -f ggames-tic-tac-toe
sudo docker restart ggames-tic-tac-toe
sudo docker stop ggames-tic-tac-toe
```
