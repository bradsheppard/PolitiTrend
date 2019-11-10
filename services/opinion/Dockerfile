FROM node:10-alpine AS builder

RUN apk add python make build-base

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY src src

COPY tsconfig.json .

RUN npm install

RUN npm run build


FROM node:10-alpine AS app

WORKDIR /app

COPY --from=builder /app/build build

COPY --from=builder /app/node_modules node_modules

COPY package.json .

COPY ormconfig.json .

EXPOSE 8080

USER node


FROM app AS tester

CMD ["npm", "test"]


FROM app AS runner

CMD ["npm", "start"]
