# CampusBites Docker Deployment with Traefik

This project is configured to run with Docker and Traefik for automatic SSL certificates and reverse proxy routing.

## 🚀 Quick Start

### Local Development

1. **Clone the repository and navigate to the project directory**
   ```bash
   cd "/Users/hamdi/Developer/campusbites website/vibrant-connect-launch"
   ```

2. **Add local domains to your hosts file**
   Add these lines to `/etc/hosts`:
   ```
   127.0.0.1 campusbites.localhost
   127.0.0.1 traefik.localhost
   ```

3. **Start the local development environment**
   ```bash
   ./deploy.sh local
   ```

4. **Access your application**
   - **Application**: http://campusbites.localhost
   - **Traefik Dashboard**: http://traefik.localhost:8080

### Production Deployment

1. **Setup environment variables**
   ```bash
   cp .env.prod.example .env.prod
   ```

2. **Edit `.env.prod` with your actual values**
   ```bash
   nano .env.prod
   ```
   
   Update these variables:
   - `DOMAIN`: Your actual domain (e.g., `campusbites.com`)
   - `ACME_EMAIL`: Your email for Let's Encrypt certificates
   - `TRAEFIK_AUTH`: Generate with `htpasswd -nb username password`

3. **Deploy to production**
   ```bash
   ./deploy.sh prod
   ```

4. **Access your application**
   - **Application**: https://yourdomain.com
   - **Traefik Dashboard**: https://traefik.yourdomain.com

## 📁 Project Structure

```
├── Dockerfile                    # Multi-stage Docker build for Next.js
├── docker-compose.yml           # Local development configuration
├── docker-compose.prod.yml      # Production configuration with SSL
├── traefik.yml                  # Traefik static configuration
├── deploy.sh                    # Deployment automation script
├── .env.prod.example           # Production environment template
├── .env.local.example          # Local environment template
└── .dockerignore               # Docker ignore file
```

## 🛠 Available Commands

### Using the deployment script:

```bash
# Local development
./deploy.sh local

# Production deployment
./deploy.sh prod

# Stop all services
./deploy.sh stop

# View logs
./deploy.sh logs              # Local logs
./deploy.sh logs prod         # Production logs

# Show container status
./deploy.sh status

# Restart services
./deploy.sh restart           # Restart local
./deploy.sh restart prod      # Restart production
```

### Manual Docker commands:

```bash
# Local development
docker-compose up --build -d
docker-compose down

# Production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose logs -f campusbites
docker-compose logs -f traefik

# Rebuild and restart
docker-compose up --build --force-recreate -d
```

## 🔧 Configuration Details

### Traefik Configuration

#### Local Development
- **HTTP Port**: 80
- **Dashboard Port**: 8080 (accessible without auth)
- **Domain**: `*.localhost`
- **SSL**: Disabled

#### Production
- **HTTP Port**: 80 (redirects to HTTPS)
- **HTTPS Port**: 443
- **SSL**: Let's Encrypt automatic certificates
- **Dashboard**: Protected with basic auth
- **Security**: Enhanced headers and redirects

### Docker Configuration

#### Multi-stage Build
1. **deps**: Install dependencies
2. **builder**: Build the application
3. **runner**: Production runtime

#### Environment Variables
- `NODE_ENV`: Set to production for optimized builds
- `NEXT_TELEMETRY_DISABLED`: Disable Next.js telemetry
- `PORT`: Application port (3000)

## 🔒 Security Features

### Production Security
- **SSL/TLS**: Automatic Let's Encrypt certificates
- **HSTS**: HTTP Strict Transport Security enabled
- **Security Headers**: Comprehensive security headers
- **Basic Auth**: Traefik dashboard protected
- **Redirects**: Automatic HTTP to HTTPS and WWW to non-WWW

### Docker Security
- **Non-root user**: Application runs as `nextjs` user
- **Minimal image**: Alpine-based images
- **Layer optimization**: Multi-stage builds reduce image size

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using port 80/443
   lsof -i :80
   lsof -i :443
   
   # Stop conflicting services
   sudo systemctl stop nginx  # or apache2
   ```

2. **Permission issues with Let's Encrypt**
   ```bash
   # Ensure correct permissions
   mkdir -p letsencrypt
   chmod 600 letsencrypt
   ```

3. **DNS not resolving**
   - For local: Check `/etc/hosts` entries
   - For production: Verify DNS A records point to your server

4. **SSL certificate issues**
   ```bash
   # Check certificate status
   docker-compose logs traefik | grep -i certificate
   
   # Force certificate renewal
   docker-compose restart traefik
   ```

### Debugging Commands

```bash
# Check container health
docker ps
docker logs traefik
docker logs campusbites-app

# Inspect Traefik configuration
curl http://localhost:8080/api/http/routers
curl http://localhost:8080/api/http/services

# Test application health
curl -I http://campusbites.localhost
curl -I https://yourdomain.com
```

## 📊 Monitoring

### Health Checks

The configuration includes:
- **Traefik API**: Monitor routing and certificates
- **Access Logs**: Track incoming requests
- **Container restart policies**: Automatic recovery

### Log Locations

```bash
# Application logs
docker-compose logs campusbites

# Traefik access logs
docker-compose logs traefik | grep -v "dashboard"

# SSL certificate logs
docker-compose logs traefik | grep -i acme
```

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./deploy.sh restart prod
```

### Updating Dependencies

```bash
# Update base images
docker-compose pull
docker-compose up --build --force-recreate -d
```

### Certificate Renewal

Let's Encrypt certificates auto-renew, but you can force renewal:

```bash
# Check certificate expiry
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com 2>/dev/null | openssl x509 -noout -dates

# Force renewal (remove storage file)
sudo rm letsencrypt/acme.json
docker-compose restart traefik
```

## 🌐 Domain Configuration

### DNS Setup

For production, ensure these DNS records exist:

```
A     @              YOUR_SERVER_IP
A     www            YOUR_SERVER_IP
A     traefik        YOUR_SERVER_IP
```

### Subdomain Support

To add subdomains, modify the labels in `docker-compose.prod.yml`:

```yaml
labels:
  - "traefik.http.routers.subdomain.rule=Host(`subdomain.${DOMAIN}`)"
  - "traefik.http.routers.subdomain.entrypoints=websecure"
  - "traefik.http.routers.subdomain.tls.certresolver=letsencrypt"
```

## 📱 Environment Variables Reference

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DOMAIN` | Your domain name | `campusbites.com` |
| `ACME_EMAIL` | Email for Let's Encrypt | `admin@campusbites.com` |
| `TRAEFIK_AUTH` | Basic auth for dashboard | `admin:$2y$10$...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `NEXT_TELEMETRY_DISABLED` | Disable telemetry | `1` |

---

## 🎯 Next Steps

1. **Monitor**: Set up monitoring with tools like Grafana/Prometheus
2. **Backup**: Implement automated backups for certificates and data
3. **CI/CD**: Set up automated deployments with GitHub Actions
4. **Scaling**: Consider Docker Swarm or Kubernetes for high availability

For support, check the [Traefik documentation](https://doc.traefik.io/traefik/) and [Next.js Docker documentation](https://nextjs.org/docs/deployment#docker-image).
