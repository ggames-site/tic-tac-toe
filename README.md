# GGames — Крестики-нолики

Классическая игра «Крестики-нолики» на React Router SSR, TypeScript и Vite с русской и английской локализацией.

## Локальная разработка

```bash
npm ci
npm run dev
```

Проверки и production-сборка:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Проверить production SSR-сервер локально:

```bash
npm start
```

Сервер по умолчанию слушает порт `3000`. Доступны API-маршруты `GET /api/healthcheck` и `POST /api/stats/save`.

## Docker

Production-образ запускает React Router SSR-сервер на порту `80`.

```bash
docker build -t ggames-tic-tac-toe:local .
docker run --rm -p 8080:80 ggames-tic-tac-toe:local
```

После запуска приложение доступно по адресу `http://localhost:8080`.

## Публикация образа

Workflow [Build and publish Docker image](./.github/workflows/docker-publish.yml) запускается при отправке Git-тега или вручную из **Actions**. Он собирает образы для `linux/amd64` и `linux/arm64` и прикрепляет Docker-архивы и файл `SHA256SUMS` к GitHub Release:

```text
ggames-tic-tac-toe-linux-amd64.tar.gz
ggames-tic-tac-toe-linux-arm64.tar.gz
SHA256SUMS
```

Для релиза создайте и отправьте тег после того, как workflow уже попадёт в основную ветку:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Для тега будет создан или обновлён GitHub Release. Дополнительные secrets не нужны: workflow использует встроенный `GITHUB_TOKEN` с разрешением `contents: write`.

## Развёртывание на Ubuntu

Скрипт [scripts/deploy.sh](./scripts/deploy.sh) установит Docker Engine при необходимости, скачает архив образа для архитектуры сервера из последнего GitHub Release, проверит его SHA-256 и запустит контейнер с политикой перезапуска `unless-stopped`.

Из клонированного репозитория:

```bash
sudo bash scripts/deploy.sh
```

Или одной командой на сервере без клонирования репозитория:

```bash
curl -fsSL https://raw.githubusercontent.com/ggames-site/tic-tac-toe/main/scripts/deploy.sh | sudo bash
```

При первом запуске можно выбрать адрес привязки и внешний порт; по умолчанию используются `0.0.0.0` и `8080`. Для reverse proxy укажите адрес `127.0.0.1`. При повторном запуске скрипт сохранит текущие сетевые настройки контейнера и обновит образ.

По умолчанию скрипт использует последний GitHub Release. Чтобы развернуть конкретный релиз, укажите его Git-тег:

```bash
curl -fsSL https://raw.githubusercontent.com/ggames-site/tic-tac-toe/main/scripts/deploy.sh | \
  sudo env RELEASE_TAG=v1.0.0 bash
```

## Управление контейнером

```bash
sudo docker ps --filter name=ggames-tic-tac-toe
sudo docker logs -f ggames-tic-tac-toe
sudo docker restart ggames-tic-tac-toe
sudo docker stop ggames-tic-tac-toe
```
