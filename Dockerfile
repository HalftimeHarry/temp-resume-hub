# Minimal working PocketBase for Railway
FROM alpine:latest

# Install dependencies
RUN apk add --no-cache ca-certificates wget unzip

# Create app directory
WORKDIR /app

# Download and install PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip \
    && unzip pocketbase_0.22.21_linux_amd64.zip \
    && chmod +x pocketbase \
    && rm pocketbase_0.22.21_linux_amd64.zip

# Create data directory
RUN mkdir -p pb_data

# Expose port
EXPOSE $PORT

# Start PocketBase (shell form to expand $PORT)
CMD ./pocketbase serve --http=0.0.0.0:$PORT