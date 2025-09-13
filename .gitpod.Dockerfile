FROM node:20-bullseye
RUN apt-get update && apt-get install -y git curl unzip tini && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /workspace
