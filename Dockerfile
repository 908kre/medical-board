FROM node:lts-slim

WORKDIR /app
ENV PATH=/app/node_modules/.bin:/app/cli/bin:$PATH
RUN apt update && apt install -y --no-install-recommends \
  wait-for-it \
  git \
  default-mysql-client \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  build-essential \
  && apt clean && git config --global --add safe.directory /app
COPY ./ ./
