# Appwrite Production Configuration Guide

This guide explains how to configure your Appwrite project for production deployment to fix CORS errors and ensure proper API access from your production domain.

## 🚨 CORS Error Fix

If you're seeing this error:
```
Access to fetch at 'https://cloud.appwrite.io/v1/account/sessions/current' from origin 'https://www.campusbites.app' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'https://localhost' that is not equal to the supplied origin.
```

This means your Appwrite project is configured with `localhost` domains instead of your production domain.

## 🔧 Fix Steps

### 1. Access Appwrite Console

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Select your CampusBites project
3. Navigate to **Settings** > **Platforms**

### 2. Configure Production Platforms

#### Web Platform Configuration

1. **Add/Edit Web Platform**:
   - **Name**: `CampusBites Production`
   - **Hostname**: `www.campusbites.app`

2. **Add Alternative Domains** (if needed):
   - **Name**: `CampusBites Main Domain`
   - **Hostname**: `campusbites.app`

#### Important Notes
- ⚠️ **Remove or disable** any localhost platforms in production
- ✅ Ensure the hostname matches exactly with your production domain
- ✅ Use HTTPS for production (http:// for local development only)

### 3. Environment Variables

Ensure your production environment has the correct variables:

```bash
# Production Environment (.env.prod or deployment configuration)
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-production-project-id
NEXT_PUBLIC_APP_URL=https://www.campusbites.app
```

### 4. Verification

After configuring the platforms, test the setup:

1. **Clear browser cache** and cookies for your domain
2. **Redeploy your application** to ensure environment variables are updated
3. **Test authentication flow**:
   - Visit `https://www.campusbites.app/en/login`
   - Try logging in with test credentials
   - Check browser console for CORS errors

## 🔍 Platform Configuration Reference

### Development Platform
```
Name: CampusBites Development
Hostname: localhost
Port: 3000 (optional)
```

### Production Platform
```
Name: CampusBites Production
Hostname: www.campusbites.app
```

### Staging Platform (if applicable)
```
Name: CampusBites Staging
Hostname: staging.campusbites.app
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] ✅ Appwrite project has production hostname configured
- [ ] ✅ Environment variables point to production domain
- [ ] ✅ SSL certificate is properly configured
- [ ] ✅ DNS records point to correct deployment
- [ ] ✅ Test authentication flow works
- [ ] ✅ No CORS errors in browser console

## 🐛 Troubleshooting

### Common Issues

1. **Still getting CORS errors**:
   - Check if old localhost platforms are still enabled
   - Verify hostname matches exactly (with/without www)
   - Clear browser cache and try incognito mode

2. **Authentication not working**:
   - Verify project ID in environment variables
   - Check if Appwrite service is accessible
   - Ensure API keys have correct permissions

3. **Redirect issues**:
   - Check redirect URLs in Auth settings
   - Ensure environment variables are loaded correctly

### Testing Commands

```bash
# Test API connectivity
curl -H "X-Appwrite-Project: your-project-id" \
     https://cloud.appwrite.io/v1/health

# Verify environment variables in deployment
echo $NEXT_PUBLIC_APPWRITE_PROJECT_ID
echo $NEXT_PUBLIC_APP_URL
```

## 📞 Support

If you continue to experience issues:

1. Check Appwrite documentation: https://appwrite.io/docs
2. Verify all platform configurations in Appwrite console
3. Ensure environment variables are properly set in your deployment platform
4. Test with a fresh browser session or incognito mode

## 🔄 Migration from Development

When moving from development to production:

1. **Create new Appwrite project** for production (recommended)
2. **Or update existing project** platforms to include production domain
3. **Update environment variables** in your deployment
4. **Test thoroughly** before switching DNS

---

**Last Updated**: January 2025
**Version**: 1.0