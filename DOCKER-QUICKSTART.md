# OpenScope Docker Quick Start

## 🚀 Quick Commands

### Build and Run
```bash
# Build the image
docker build -t openscope:latest .

# Run the container
docker run -d --name openscope-atc -p 3003:3003 openscope:latest

# Access the application
open http://localhost:3003
```

### Using Docker Compose
```bash
# Deploy with one command
./docker-deploy.sh

# Or manually
docker-compose up -d
```

### Management
```bash
# View logs
docker logs openscope-atc

# Stop container
docker stop openscope-atc

# Remove container
docker rm openscope-atc

# Remove image
docker rmi openscope:latest
```

## 📊 Image Details
- **Base**: Node.js 11.3.0 (Alpine Linux)
- **Size**: ~182MB
- **Security**: Non-root user (UID 1001)
- **Health Check**: Built-in HTTP health monitoring

## 🔧 Production Notes
- Application runs on port 3003
- Health check runs every 30 seconds
- Logs are available via `docker logs`
- Container restarts automatically unless stopped

For detailed documentation, see [DOCKER.md](DOCKER.md)
