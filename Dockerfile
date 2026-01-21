# ---------- BUILD ----------
FROM golang:1.25 AS builder
WORKDIR /app

# Copie des fichiers Go
COPY go.mod ./
COPY main.go ./

# Copie des fichiers FRONT nécessaires à go:embed
COPY index.html ./
COPY style.css ./
COPY script.js ./
COPY assets ./assets

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o portfolio main.go

# ---------- RUN ----------
FROM alpine:3.20
WORKDIR /app

COPY --from=builder /app/portfolio /app/portfolio

EXPOSE 8080
CMD ["/app/portfolio"]
