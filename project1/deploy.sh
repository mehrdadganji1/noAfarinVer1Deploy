#!/bin/bash

# ===========================================
# NoAfarin Platform - Deployment Script
# ===========================================
# Usage: ./deploy.sh [command]
# Commands: setup, build, start, stop, restart, logs, status, backup, update

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════╗"
    echo "║     🚀 NoAfarin Platform Deployment        ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        exit 1
    fi
    
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed!"
        exit 1
    fi
    
    print_success "All requirements met"
}

check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Environment file not found: $ENV_FILE"
        print_info "Please copy .env.production.example to .env.production and configure it"
        exit 1
    fi
}

setup() {
    print_header
    print_info "Setting up NoAfarin Platform..."
    
    check_requirements
    
    # Create env file if not exists
    if [ ! -f "$ENV_FILE" ]; then
        print_info "Creating environment file..."
        cp .env.production.example $ENV_FILE
        
        # Generate secrets
        JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
        MONGO_PASS=$(openssl rand -base64 32 | tr -d '\n')
        RABBITMQ_PASS=$(openssl rand -base64 24 | tr -d '\n')
        
        # Update env file with generated secrets
        sed -i "s/your_very_long_and_secure_jwt_secret_key_at_least_64_characters/$JWT_SECRET/g" $ENV_FILE
        sed -i "s/your_very_secure_password_here/$MONGO_PASS/g" $ENV_FILE
        sed -i "s/your_rabbitmq_password/$RABBITMQ_PASS/g" $ENV_FILE
        
        print_warning "Environment file created with generated secrets"
        print_warning "Please edit $ENV_FILE and configure:"
        echo "  - FRONTEND_URL (your domain)"
        echo "  - VITE_API_URL (your API URL)"
        echo "  - SMTP settings (for email)"
        echo "  - SMS settings (optional)"
    else
        print_success "Environment file already exists"
    fi
    
    # Create SSL directory
    mkdir -p frontend/ssl
    print_info "SSL directory created at frontend/ssl/"
    print_warning "Please add your SSL certificates:"
    echo "  - frontend/ssl/fullchain.pem"
    echo "  - frontend/ssl/privkey.pem"
    
    # Create backup directory
    mkdir -p $BACKUP_DIR
    print_success "Backup directory created"
    
    print_success "Setup complete!"
}

build() {
    print_header
    print_info "Building all services..."
    
    check_requirements
    check_env_file
    
    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE build
    
    print_success "Build complete!"
}

start() {
    print_header
    print_info "Starting NoAfarin Platform..."
    
    check_requirements
    check_env_file
    
    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d
    
    print_success "Platform started!"
    print_info "Checking service status..."
    sleep 5
    status
}

stop() {
    print_header
    print_info "Stopping NoAfarin Platform..."
    
    docker compose -f $COMPOSE_FILE down
    
    print_success "Platform stopped!"
}

restart() {
    print_header
    print_info "Restarting NoAfarin Platform..."
    
    check_requirements
    check_env_file
    
    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE restart
    
    print_success "Platform restarted!"
}

logs() {
    SERVICE=${2:-""}
    if [ -z "$SERVICE" ]; then
        docker compose -f $COMPOSE_FILE logs -f
    else
        docker compose -f $COMPOSE_FILE logs -f $SERVICE
    fi
}

status() {
    print_header
    print_info "Service Status:"
    echo ""
    docker compose -f $COMPOSE_FILE ps
    echo ""
    
    # Check health endpoints
    print_info "Health Check:"
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health | grep -q "200"; then
        print_success "API Gateway: Healthy"
    else
        print_warning "API Gateway: Not responding"
    fi
}

backup() {
    print_header
    print_info "Creating backup..."
    
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/backup-$TIMESTAMP"
    mkdir -p $BACKUP_PATH
    
    # Get MongoDB credentials from env file
    source $ENV_FILE
    
    # Backup MongoDB
    print_info "Backing up MongoDB..."
    docker exec noafarin-mongodb mongodump \
        --username $MONGO_INITDB_ROOT_USERNAME \
        --password $MONGO_INITDB_ROOT_PASSWORD \
        --authenticationDatabase admin \
        --out /backup
    
    docker cp noafarin-mongodb:/backup $BACKUP_PATH/mongodb
    
    # Backup uploads
    print_info "Backing up uploads..."
    docker cp noafarin-file-service:/app/uploads $BACKUP_PATH/uploads 2>/dev/null || true
    
    # Compress backup
    print_info "Compressing backup..."
    tar -czf "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz" -C $BACKUP_DIR "backup-$TIMESTAMP"
    rm -rf $BACKUP_PATH
    
    print_success "Backup created: $BACKUP_DIR/backup-$TIMESTAMP.tar.gz"
}

update() {
    print_header
    print_info "Updating NoAfarin Platform..."
    
    # Pull latest changes
    print_info "Pulling latest changes..."
    git pull origin main
    
    # Rebuild and restart
    print_info "Rebuilding services..."
    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE build
    
    print_info "Restarting services..."
    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d
    
    print_success "Update complete!"
}

cleanup() {
    print_header
    print_warning "This will remove unused Docker resources"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -a
        print_success "Cleanup complete!"
    fi
}

help() {
    print_header
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Initial setup (create env file, directories)"
    echo "  build     - Build all Docker images"
    echo "  start     - Start all services"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  logs      - View logs (optional: service name)"
    echo "  status    - Show service status"
    echo "  backup    - Create database backup"
    echo "  update    - Pull latest code and redeploy"
    echo "  cleanup   - Remove unused Docker resources"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh setup"
    echo "  ./deploy.sh build"
    echo "  ./deploy.sh start"
    echo "  ./deploy.sh logs user-service"
}

# Main
case "${1:-help}" in
    setup)
        setup
        ;;
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$@"
        ;;
    status)
        status
        ;;
    backup)
        backup
        ;;
    update)
        update
        ;;
    cleanup)
        cleanup
        ;;
    help|*)
        help
        ;;
esac
