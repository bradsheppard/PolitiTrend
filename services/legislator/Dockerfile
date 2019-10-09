FROM node:10-alpine AS builder

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY src src

COPY tsconfig.json .

RUN npm install

RUN npm run build


FROM node:10-alpine AS tester

WORKDIR /app

COPY --from=builder /app/build build

COPY --from=builder /app/node_modules node_modules

COPY data data

COPY package.json .

COPY ormconfig.json .

EXPOSE 8080

USER node

CMD ["npm", "test"]


FROM node:10-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build build

COPY --from=builder /app/node_modules node_modules

COPY data data

COPY package.json .

COPY ormconfig.json .

EXPOSE 8080

USER node

CMD ["npm", "start"]
