FROM node:12-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json .env ./

RUN npm install

COPY src src

RUN npm run build


FROM node:12-alpine AS app

WORKDIR /app

COPY package.json next.config.js .env ./

COPY public public

COPY --from=builder /app/node_modules node_modules

COPY --from=builder /app/.next .next

EXPOSE 3000

USER node


FROM builder AS tester

CMD ["npm", "run", "test"]


FROM app AS runner

CMD ["npm", "start"]
