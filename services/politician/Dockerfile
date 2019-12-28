FROM node:10-alpine AS builder

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY src src

COPY test test

COPY tsconfig.json .

COPY tsconfig.build.json .

RUN npm run build


FROM node:10-alpine AS app

WORKDIR /app

COPY --from=builder /app/dist dist

COPY --from=builder /app/node_modules node_modules

COPY data data

COPY package.json .

COPY ormconfig.json .

EXPOSE 3000

USER node


FROM builder AS tester

COPY ormconfig.json .

CMD ["npm", "run", "test:e2e"]


FROM app AS runner

CMD ["npm", "run", "start:prod"]
