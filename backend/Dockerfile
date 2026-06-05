FROM golang:1.26.1-alpine3.22 AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/server .

RUN mkdir -p /app/data

ENV PORT=8080
ENV DATA_FILE=/app/data/habits.json

EXPOSE 8080

CMD ["./server"]