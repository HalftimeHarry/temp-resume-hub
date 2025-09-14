# Use the official PocketBase image
FROM alpine:latest

# Install ca-certificates and unzip for HTTPS and extraction
RUN apk --no-cache add ca-certificates unzip curl

# Set working directory
WORKDIR /pb

# Download PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip /tmp/pb.zip

# Extract and setup PocketBase
RUN unzip /tmp/pb.zip -d /pb/ && \
    chmod +x /pb/pocketbase && \
    rm /tmp/pb.zip

# Create necessary directories
RUN mkdir -p /pb/pb_data /pb/pb_public /pb/pb_hooks /pb/pb_migrations

# Copy configuration files
COPY pb_hooks/ /pb/pb_hooks/
COPY pb_migrations/ /pb/pb_migrations/
COPY .env* /pb/

# Set environment variables
ENV PORT=8080
ENV ADMIN_EMAIL=ddinsmore8@gmail.com
ENV ADMIN_PASSWORD=MADcap(123)

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data", "--publicDir=/pb/pb_public"]