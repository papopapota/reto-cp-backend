FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package*.json pnpm-lock.yaml* .npmrc ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build
RUN pnpm exec prisma generate
RUN pnpm prune --prod

FROM node:20-alpine AS production

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma

USER node
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]