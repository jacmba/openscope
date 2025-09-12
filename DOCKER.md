# OpenScope Docker Deployment

This document provides instructions for deploying OpenScope using Docker.

## Prerequisites

- Docker 20.10+ 
- Docker Compose 2.0+
- Git (to clone the repository)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/openscope/openscope.git
   cd openscope
   ```

2. **Deploy using the provided script:**
   ```bash
   ./docker-deploy.sh
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3003`

### Option 2: Manual Docker Commands

1. **Build the image:**
   ```bash
   docker build -t openscope:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name openscope-atc \
     -p 3003:3003 \
     -e NODE_ENV=production \
     --restart unless-stopped \
     openscope:latest
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:3003`

## Docker Compose Configuration

The `docker-compose.yml` file includes:

- **Multi-stage build** for optimized image size
- **Health checks** to ensure application availability
- **Volume mounting** for logs persistence
- **Network isolation** for security
- **Restart policy** for high availability

## Image Details

### Base Image
- **Node.js**: 11.3.0 (Alpine Linux)
- **Size**: ~150MB (optimized production image)

### Security Features
- **Non-root user**: Application runs as `openscope` user (UID 1001)
- **Minimal dependencies**: Only production packages included
- **Alpine Linux**: Reduced attack surface

### Build Process
1. **Stage 1 (Builder)**: Installs dependencies and builds the application
2. **Stage 2 (Production)**: Creates minimal runtime image with only necessary files

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |

## Ports

| Port | Description |
|------|-------------|
| 3003 | HTTP server port |

## Volumes

| Volume | Description |
|--------|-------------|
| `openscope_logs` | Application logs |

## Health Check

The container includes a health check that:
- Runs every 30 seconds
- Checks HTTP response on port 3003
- Considers the container unhealthy after 3 consecutive failures
- Waits 40 seconds before starting health checks

## Management Commands

### View Logs
```bash
# All logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Specific service logs
docker-compose logs openscope
```

### Container Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View running containers
docker-compose ps
```

### Image Management
```bash
# Rebuild image
docker-compose build --no-cache

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune
```

## Troubleshooting

### Application Won't Start
1. Check if port 3003 is available:
   ```bash
   netstat -tulpn | grep :3003
   ```

2. View container logs:
   ```bash
   docker-compose logs openscope
   ```

3. Check container status:
   ```bash
   docker-compose ps
   ```

### Performance Issues
1. Monitor resource usage:
   ```bash
   docker stats openscope-atc
   ```

2. Check system resources:
   ```bash
   docker system df
   ```

### Security Considerations
- The application runs on a non-root user
- Only necessary ports are exposed
- Minimal Alpine Linux base image
- No development dependencies in production image

## Production Deployment

For production deployment, consider:

1. **Reverse Proxy**: Use nginx or Traefik for SSL termination
2. **Load Balancer**: For high availability
3. **Monitoring**: Add Prometheus/Grafana for metrics
4. **Logging**: Centralized logging with ELK stack
5. **Backup**: Regular volume backups

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Support

For issues related to Docker deployment:
1. Check the logs: `docker-compose logs`
2. Verify system requirements
3. Create an issue on GitHub with deployment details

## License

This Docker configuration follows the same MIT license as the OpenScope project.
