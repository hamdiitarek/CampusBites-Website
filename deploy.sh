#!/bin/bash

# Deployment script for CampusBites with Docker and Traefik

set -e

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "All dependencies are installed."
}

# Function to setup local development
setup_local() {
    print_status "Setting up local development environment..."
    
    # Create local environment file if it doesn't exist
    if [ ! -f .env.local ]; then
        cp .env.local.example .env.local
        print_status "Created .env.local file from example"
    fi
    
    # Start local development stack
    docker-compose down --remove-orphans
    docker-compose up --build -d
    
    print_status "Local development environment is starting..."
    print_status "Application will be available at: http://campusbites.localhost"
    print_status "Traefik dashboard will be available at: http://traefik.localhost:8080"
    print_status "Add these entries to your /etc/hosts file:"
    echo "127.0.0.1 campusbites.localhost"
    echo "127.0.0.1 traefik.localhost"
}

# Function to setup production
setup_production() {
    print_status "Setting up production environment..."
    
    # Check if production env file exists
    if [ ! -f .env.prod ]; then
        if [ ! -f .env.prod.example ]; then
            print_error ".env.prod.example file not found"
            exit 1
        fi
        
        cp .env.prod.example .env.prod
        print_warning "Created .env.prod file from example"
        print_warning "Please edit .env.prod file with your actual values before proceeding"
        print_warning "Don't forget to:"
        print_warning "1. Set your actual domain name"
        print_warning "2. Set your email for Let's Encrypt"
        print_warning "3. Generate a secure password for Traefik dashboard"
        return 1
    fi
    
    # Source the production environment file
    source .env.prod
    
    # Validate required variables
    if [ -z "$DOMAIN" ] || [ -z "$ACME_EMAIL" ]; then
        print_error "Please set DOMAIN and ACME_EMAIL in .env.prod"
        exit 1
    fi
    
    # Create letsencrypt directory
    mkdir -p letsencrypt
    chmod 600 letsencrypt
    
    # Start production stack
    docker-compose -f docker-compose.prod.yml --env-file .env.prod down --remove-orphans
    docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
    
    print_status "Production environment is starting..."
    print_status "Application will be available at: https://$DOMAIN"
    print_status "Traefik dashboard will be available at: https://traefik.$DOMAIN"
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down --remove-orphans
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    print_status "Services stopped."
}

# Function to show logs
show_logs() {
    if [ "$1" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Function to show status
show_status() {
    print_status "Docker containers status:"
    docker ps --filter "name=campusbites" --filter "name=traefik"
}

# Main script logic
case "$1" in
    "local")
        check_dependencies
        setup_local
        ;;
    "prod")
        check_dependencies
        setup_production
        ;;
    "stop")
        stop_services
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "restart")
        stop_services
        if [ "$2" = "prod" ]; then
            setup_production
        else
            setup_local
        fi
        ;;
    *)
        echo "Usage: $0 {local|prod|stop|logs [prod]|status|restart [prod]}"
        echo ""
        echo "Commands:"
        echo "  local    - Start local development environment"
        echo "  prod     - Start production environment"
        echo "  stop     - Stop all services"
        echo "  logs     - Show logs (add 'prod' for production logs)"
        echo "  status   - Show container status"
        echo "  restart  - Restart services (add 'prod' for production)"
        echo ""
        echo "Examples:"
        echo "  $0 local              # Start local development"
        echo "  $0 prod               # Start production"
        echo "  $0 logs               # Show local logs"
        echo "  $0 logs prod          # Show production logs"
        echo "  $0 restart prod       # Restart production"
        exit 1
        ;;
esac
