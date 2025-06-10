# CampusBites - Campus Food Delivery Platform 🍕

Egypt's premier campus food delivery application built with Next.js, designed specifically for university campuses across Egypt.

## 🎯 Project Overview

**CampusBites** is a comprehensive food delivery platform tailored for Egyptian university campuses, connecting students with campus restaurants, cafeterias, and food vendors. The platform offers real-time order tracking, multi-language support (Arabic/English), and optimized delivery for campus environments.

### 🌟 Key Features

- **🏫 Campus-Optimized**: Designed specifically for university environments
- **🚀 Fast Delivery**: Average 15-minute delivery times across campus
- **🌍 Bilingual Support**: Full Arabic (RTL) and English localization
- **📱 Mobile-First**: Responsive design optimized for mobile devices
- **🎯 Real-Time Tracking**: Live order tracking and notifications
- **💳 Multiple Payment Options**: Cards, digital wallets, and campus meal plans
- **👥 Multi-Role Platform**: Students, vendors, and administrators
- **🔒 Production Ready**: Docker containerized with optimized builds

## 🛠 Technology Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Build Tool**: Bun (optimized build performance)
- **Deployment**: Docker with multi-stage builds
- **Internationalization**: Built-in i18n with RTL support
- **State Management**: React Context API
- **SEO**: Optimized meta tags and structured data

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended) or **Bun** for optimal performance
- **Docker** (for containerized deployment)
- **Git** for version control

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd campusbites-website

# Install dependencies (using bun for faster installation)
bun install
# or using npm
npm install

# Start development server
bun dev
# or using npm
npm run dev

# Open in browser
open http://localhost:3000
```

### Development Commands

```bash
# Install dependencies
bun install

# Start development server with hot reload
bun dev

# Build for production
bun run build

# Start production server locally
bun start

# Run linting
bun run lint

# Type checking
bun run type-check
```

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t campusbites-app .

# Run the container
docker run -d -p 3000:3000 --name campusbites-container campusbites-app

# Check container status
docker ps

# View application logs
docker logs campusbites-container
```

### Docker Management Commands

```bash
# Stop the container
docker stop campusbites-container

# Start the container
docker start campusbites-container

# Restart the container
docker restart campusbites-container

# Remove the container
docker rm campusbites-container

# Remove the image
docker rmi campusbites-app

# View container resource usage
docker stats campusbites-container --no-stream

# Execute commands inside container
docker exec -it campusbites-container /bin/sh
```

### Docker Compose (Production)

```bash
# Start with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## 🌐 Multi-Language Support

The application supports both Arabic (RTL) and English languages:

- **English**: `/en/` routes
- **Arabic**: `/ar/` routes with full RTL layout support
- **Auto-detection**: Browser language preference detection
- **SEO Optimized**: Proper hreflang and canonical tags

### Language Structure

```
app/
├── en/           # English routes
├── ar/           # Arabic routes (RTL)
├── components/   # Shared components
└── contexts/     # Language context
```

## 📁 Project Structure

```
campusbites-website/
├── app/                    # Next.js App Router
│   ├── (landing)/         # Landing page group
│   ├── en/                # English routes
│   ├── ar/                # Arabic routes
│   ├── components/        # Shared components
│   ├── contexts/          # React contexts
│   └── lib/               # Utility functions
├── public/                # Static assets
├── components.json        # shadcn/ui configuration
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── package.json          # Dependencies and scripts
```

## 🎨 UI Components

Built with **shadcn/ui** for consistent and accessible components:

```bash
# Add new UI components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CampusBites

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# API Configuration (when ready)
NEXT_PUBLIC_API_URL=https://api.campusbites.com
```

### Next.js Configuration

Key configurations in `next.config.mjs`:

- Internationalization (i18n) setup
- Image optimization
- Bundle analysis
- Performance optimizations

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: 320px - 768px (Primary focus)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **RTL Support**: Complete right-to-left layout for Arabic

## 🚢 Production Deployment

### Deploy to Cloud Platforms

#### Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Docker on Cloud Platforms
```bash
# Tag for registry
docker tag campusbites-app your-registry/campusbites-app:latest

# Push to registry
docker push your-registry/campusbites-app:latest

# Deploy on your cloud platform
# (AWS ECS, Google Cloud Run, Azure Container Instances, etc.)
```

### Performance Optimizations

- **Static Generation**: Pre-rendered pages for optimal performance
- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Optimization**: Code splitting and tree shaking
- **Caching**: Proper cache headers and static asset optimization
- **Docker Multi-stage**: Optimized production Docker image (1.19GB)

## 📊 Build Statistics

Production build generates:
- **10 static pages** pre-rendered
- **First Load JS**: ~101 kB shared
- **Route segments**: Optimized code splitting
- **Bundle size**: Minimized for fast loading

## 🔍 SEO & Performance

- **SEO Optimized**: Meta tags, structured data, sitemaps
- **Performance**: Lighthouse score optimized
- **Accessibility**: WCAG compliant components
- **Social Media**: Open Graph and Twitter Card meta tags
- **Schema.org**: Structured data for search engines

## 🧪 Development Tools

```bash
# Code formatting
bun run format

# Type checking
bun run type-check

# Build analysis
bun run analyze

# Bundle size analysis
bun run build && bun run start
```

## 📚 Additional Resources

- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **shadcn/ui Components**: [https://ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)


