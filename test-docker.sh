#!/bin/bash

# Docker Build Test Script for OpenScope
set -e

echo "🧪 Testing OpenScope Docker build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[TEST]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Test 1: Build the Docker image
print_status "Building Docker image..."
if docker build -t openscope-test .; then
    print_status "✅ Docker image built successfully"
else
    print_error "❌ Docker build failed"
    exit 1
fi

# Test 2: Check image size
print_status "Checking image size..."
IMAGE_SIZE=$(docker images openscope-test --format "{{.Size}}")
print_status "Image size: $IMAGE_SIZE"

# Test 3: Run container and test
print_status "Starting test container..."
CONTAINER_ID=$(docker run -d -p 3004:3003 --name openscope-test-container openscope-test)

# Wait for container to start
print_status "Waiting for container to start..."
sleep 15

# Test 4: Check if application responds
print_status "Testing application response..."
if curl -f http://localhost:3004 > /dev/null 2>&1; then
    print_status "✅ Application is responding on port 3004"
else
    print_error "❌ Application is not responding"
    docker logs openscope-test-container
    docker stop openscope-test-container
    docker rm openscope-test-container
    exit 1
fi

# Test 5: Check container health
print_status "Checking container health..."
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' openscope-test-container)
if [ "$HEALTH_STATUS" = "healthy" ]; then
    print_status "✅ Container health check passed"
else
    print_warning "⚠️  Container health status: $HEALTH_STATUS"
fi

# Test 6: Check if it's running as non-root user
print_status "Checking user permissions..."
USER_ID=$(docker exec openscope-test-container id -u)
if [ "$USER_ID" = "1001" ]; then
    print_status "✅ Container is running as non-root user (UID: $USER_ID)"
else
    print_warning "⚠️  Container is running as user with UID: $USER_ID"
fi

# Cleanup
print_status "Cleaning up test container..."
docker stop openscope-test-container
docker rm openscope-test-container
docker rmi openscope-test

print_status "🎉 All tests passed! Docker configuration is working correctly."
print_status "You can now deploy using: ./docker-deploy.sh"
