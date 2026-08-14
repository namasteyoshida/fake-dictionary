FROM node:22-slim

RUN corepack enable

WORKDIR /app

COPY package.json .npmrc* ./
RUN pnpm install --config.only-built-dependencies=esbuild

COPY . .
RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start"]

