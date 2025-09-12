#!/bin/bash

# OpenScope Docker Deployment Script
set -e

echo "🚀 Starting OpenScope Docker deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker compose is available
if ! command -v docker compose &> /dev/null; then
    print_error "docker compose is not installed. Please install docker compose and try again."
    exit 1
fi

# Build the image
print_status "Building OpenScope Docker image..."
docker compose build --no-cache

# Stop existing containers
print_status "Stopping existing containers..."
docker compose down

# Start the application
print_status "Starting OpenScope application..."
docker compose up -d

# Wait for the application to start
print_status "Waiting for application to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:3003 > /dev/null 2>&1; then
    print_status "✅ OpenScope is running successfully!"
    print_status "🌐 Application URL: http://localhost:3003"
    print_status "📊 Container status:"
    docker compose ps
else
    print_error "❌ Application failed to start. Checking logs..."
    docker compose logs
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_status "To view logs: docker compose logs -f"
print_status "To stop: docker compose down"
