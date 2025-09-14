#!/bin/bash

# Test Docker build locally before Railway deployment

echo "🐳 Testing Docker build locally..."

# Build the image
echo "Building Docker image..."
docker build -t test-resume-hub .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    echo "🚀 Testing container startup..."
    # Run container in background
    docker run -d -p 8080:8080 --name test-resume-hub-container test-resume-hub
    
    # Wait a moment for startup
    echo "⏳ Waiting for container to start..."
    sleep 10
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    curl -f http://localhost:8080/api/health
    
    if [ $? -eq 0 ]; then
        echo "✅ Health check passed!"
        echo "🎉 Docker build is working correctly!"
        echo ""
        echo "📋 Next steps:"
        echo "1. Commit and push changes to GitHub"
        echo "2. Deploy to Railway (will now use this Dockerfile)"
        echo "3. Test Railway deployment"
    else
        echo "❌ Health check failed"
        echo "🔍 Check container logs:"
        docker logs test-resume-hub-container
    fi
    
    # Cleanup
    echo "🧹 Cleaning up test container..."
    docker stop test-resume-hub-container
    docker rm test-resume-hub-container
    docker rmi test-resume-hub
    
else
    echo "❌ Docker build failed!"
    echo "🔍 Check the Dockerfile and backend directory structure"
fi