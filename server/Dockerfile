# 開発用Dockerfile(ホットリロード前提。本番用ではありません)
FROM node:22-slim

RUN corepack enable

WORKDIR /app

COPY package.json ./
RUN pnpm install

COPY . .

EXPOSE 3001

CMD ["pnpm", "dev"]
