FROM alpine:latest

WORKDIR /usr/app

RUN apk update
RUN apk add sqlite
RUN apk add nodejs
RUN apk add bash
RUN apk add npm
RUN npm install sqlite3
RUN npm install @fastify/view ejs

COPY conf/transcendence.db .
COPY tools/sample.js .
COPY tools/server.js .
COPY tools/site .

#WORKDIR /app
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD ["node", "index.js"]
