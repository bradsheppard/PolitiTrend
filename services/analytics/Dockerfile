FROM node:12-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./

RUN npm install

COPY src src

COPY test test

RUN npm run build


FROM node:12-alpine AS app

WORKDIR /app

COPY --from=builder /app/dist dist

COPY --from=builder /app/node_modules node_modules

COPY package.json .env ./

EXPOSE 3000

USER node


FROM builder AS tester

CMD ["npm", "run", "test:e2e"]


FROM app AS runner

CMD ["npm", "run", "start:prod"]
