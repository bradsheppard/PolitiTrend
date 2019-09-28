FROM node:10-alpine AS builder

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY src src

COPY tsconfig.json .

RUN npm install

RUN npm run build


FROM node:10-alpine

WORKDIR /app

COPY --from=builder /app/build build

COPY --from=builder /app/node_modules node_modules

COPY package.json .

EXPOSE 8081

CMD ["npm", "start"]
