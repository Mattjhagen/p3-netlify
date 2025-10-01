#!/bin/bash

# P³ Lending Platform Deployment Script
# This script builds and deploys the platform to Cloudflare Pages

set -e

echo "🚀 Starting P³ Lending Platform Deployment..."

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v wrangler &> /dev/null; then
        echo "❌ Wrangler CLI is not installed. Installing..."
        npm install -g wrangler
    fi
    
    echo "✅ All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed successfully"
}

# Run type checking
type_check() {
    echo "🔍 Running TypeScript type checking..."
    npm run type-check
    echo "✅ Type checking passed"
}

# Run linting
lint_code() {
    echo "🧹 Running code linting..."
    npm run lint
    echo "✅ Linting passed"
}

# Run tests
run_tests() {
    echo "🧪 Running tests..."
    npm run test
    echo "✅ Tests passed"
}

# Build the project
build_project() {
    echo "🏗️ Building the project..."
    npm run build
    echo "✅ Build completed successfully"
}

# Deploy to Cloudflare Pages
deploy_to_cloudflare() {
    echo "☁️ Deploying to Cloudflare Pages..."
    
    # Check if wrangler is authenticated
    if ! wrangler whoami &> /dev/null; then
        echo "🔐 Please authenticate with Cloudflare first:"
        wrangler login
    fi
    
    # Deploy to Cloudflare Pages
    wrangler pages deploy dist --project-name p3-lending-platform
    
    echo "✅ Deployment completed successfully"
}

# Main deployment function
main() {
    echo "🎯 P³ Lending Platform Deployment"
    echo "=================================="
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Run deployment steps
    check_dependencies
    install_dependencies
    type_check
    lint_code
    run_tests
    build_project
    deploy_to_cloudflare
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "🌐 Your P³ Lending Platform is now live on Cloudflare Pages"
    echo "📊 Monitor your deployment at: https://dash.cloudflare.com/pages"
    echo ""
    echo "🔗 Next steps:"
    echo "  1. Configure your custom domain in Cloudflare dashboard"
    echo "  2. Set up environment variables for production"
    echo "  3. Configure monitoring and analytics"
    echo "  4. Set up CI/CD for automatic deployments"
    echo ""
}

# Handle script arguments
case "${1:-}" in
    --skip-tests)
        echo "⚠️ Skipping tests (not recommended for production)"
        check_dependencies
        install_dependencies
        type_check
        lint_code
        build_project
        deploy_to_cloudflare
        ;;
    --help)
        echo "P³ Lending Platform Deployment Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --skip-tests    Skip running tests (not recommended)"
        echo "  --help          Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0              Full deployment with all checks"
        echo "  $0 --skip-tests Deploy without running tests"
        ;;
    *)
        main
        ;;
esac
