FROM node:10-alpine AS builder

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY public public

COPY tsconfig.json .

COPY src src

RUN npm run build


FROM node:10-alpine AS app

WORKDIR /app

COPY --from=builder /app/.next .next

COPY --from=builder /app/public public

COPY --from=builder /app/node_modules node_modules

COPY package.json .

EXPOSE 3000

USER node


FROM app AS runner

CMD ["npm", "start"]

