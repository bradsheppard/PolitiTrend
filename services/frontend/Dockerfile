FROM node:10-alpine AS builder

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY src src

COPY public public

COPY tsconfig.json .

RUN npm install

RUN npm run build


FROM node:10-alpine AS app

WORKDIR /app

COPY --from=builder /app/dist dist

COPY --from=builder /app/.next .next

COPY --from=builder /app/public public

COPY --from=builder /app/node_modules node_modules

COPY package.json .

EXPOSE 3000

USER node


FROM app AS runner

CMD ["npm", "start"]

