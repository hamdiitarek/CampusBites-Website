# Production Deployment Checklist

Use this checklist to ensure proper deployment of CampusBites to production.

## 🚀 Pre-Deployment Setup

### 1. Environment Configuration

- [ ] Create `.env.prod` from `.env.prod.example`
- [ ] Set `DOMAIN` to your production domain (e.g., `campusbites.com`)
- [ ] Set `NEXT_PUBLIC_APP_URL` to your full production URL (e.g., `https://www.campusbites.app`)
- [ ] Configure `ACME_EMAIL` for SSL certificates
- [ ] Generate `TRAEFIK_AUTH` credentials for dashboard access

### 2. Appwrite Configuration

- [ ] Create Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io)
- [ ] Set up database schema: `npm run appwrite:setup`
- [ ] Configure web platform in Appwrite Console:
  - [ ] Platform Name: "CampusBites Production"
  - [ ] Hostname: `www.campusbites.app`
  - [ ] Remove/disable localhost platforms
- [ ] Update environment variables:
  - [ ] `NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1`
  - [ ] `NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id`
  - [ ] `NEXT_PUBLIC_APPWRITE_DATABASE_ID=main`

### 3. DNS Configuration

- [ ] Point your domain to your server/hosting platform
- [ ] Ensure both `campusbites.app` and `www.campusbites.app` resolve correctly
- [ ] Verify DNS propagation: `nslookup www.campusbites.app`

## 🔧 Deployment Process

### Option A: Docker Deployment

```bash
# 1. Copy production environment
cp .env.prod.example .env.prod
# Edit .env.prod with your values

# 2. Deploy with docker-compose
./deploy.sh prod

# 3. Verify deployment
docker-compose -f docker-compose.prod.yml ps
```

### Option B: Platform Deployment (Vercel, etc.)

```bash
# 1. Set environment variables in your platform
# 2. Deploy from repository
# 3. Ensure custom domain is configured
```

## ✅ Post-Deployment Verification

### 1. Basic Connectivity

- [ ] Website loads at `https://www.campusbites.app`
- [ ] SSL certificate is valid and auto-renewed
- [ ] Both `www` and non-`www` domains work
- [ ] Mobile responsiveness works correctly

### 2. CORS Configuration

- [ ] Run CORS verification: `npm run cors:verify`
- [ ] No CORS errors in browser console
- [ ] Authentication endpoints accessible

### 3. Authentication Flow

- [ ] Login page loads: `https://www.campusbites.app/en/login`
- [ ] Registration works correctly
- [ ] Password reset functions properly
- [ ] Dashboard redirects work for all roles

### 4. API Functionality

- [ ] User registration creates Appwrite account
- [ ] Login creates proper session
- [ ] User data persists correctly
- [ ] File uploads work (if applicable)

### 5. Internationalization

- [ ] Arabic routes work: `https://www.campusbites.app/ar/login`
- [ ] RTL layout displays correctly
- [ ] Language switching maintains state
- [ ] All text content is translated

## 🔍 Troubleshooting

### CORS Errors
If you see CORS policy errors:
1. Check Appwrite platform configuration
2. Run `npm run cors:verify`
3. See `APPWRITE_PRODUCTION_SETUP.md`

### Authentication Issues
- Verify project ID in environment variables
- Check platform hostname configuration
- Clear browser cache and try incognito mode

### SSL Certificate Issues
- Verify ACME_EMAIL is set correctly
- Check domain DNS configuration
- Review Traefik logs: `docker-compose -f docker-compose.prod.yml logs traefik`

### General Debugging
```bash
# Check application logs
docker-compose -f docker-compose.prod.yml logs app

# Check all services status
docker-compose -f docker-compose.prod.yml ps

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

## 📊 Performance Optimization

Post-deployment optimizations:

- [ ] Enable CDN for static assets
- [ ] Configure image optimization
- [ ] Set up monitoring and analytics
- [ ] Configure backup procedures
- [ ] Set up error reporting (Sentry, etc.)

## 🔄 Maintenance

Regular maintenance tasks:

- [ ] Monitor SSL certificate renewal
- [ ] Check application logs for errors
- [ ] Update dependencies monthly
- [ ] Backup database regularly
- [ ] Monitor performance metrics

---

**Last Updated**: January 2025
**Version**: 1.0