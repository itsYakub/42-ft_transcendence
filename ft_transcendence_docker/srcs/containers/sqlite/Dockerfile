FROM alpine:latest
 
RUN apk update
RUN apk add python3
RUN apk add sqlite
RUN apk add bash
COPY conf/transcendence.db data/
COPY tools/insert.py data/
CMD ["sqlite3", "data/transcendence.db"]
