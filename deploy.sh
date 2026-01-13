#!/bin/bash

# ===========================================
# 🤖 SAUDI AI PLATFORM - AUTOMATED DEPLOYMENT
# ===========================================

echo "🚀 SAUDI AI PLATFORM DEPLOYMENT SCRIPT"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "demo.html" ]; then
    print_error "demo.html not found. Please run this script from the project root directory."
    exit 1
fi

print_status "Starting automated deployment process..."
echo ""

# Step 1: Check git status
print_status "Step 1: Checking git repository status..."
if git status --porcelain > /dev/null 2>&1; then
    print_success "Git repository is initialized"

    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "You have uncommitted changes. Committing them..."
        git add .
        git commit -m "Auto-commit before deployment"
        print_success "Changes committed"
    else
        print_success "Repository is clean"
    fi
else
    print_error "Not a git repository. Please initialize git first."
    exit 1
fi

echo ""

# Step 2: Get GitHub username
print_status "Step 2: GitHub Repository Setup"
echo "Please provide your GitHub username (e.g., saudidev):"
read -p "GitHub Username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    print_error "GitHub username is required"
    exit 1
fi

REPO_NAME="saudi-ai-platform"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

print_status "Will deploy to: $REPO_URL"
echo ""

# Step 3: Check if remote exists
print_status "Step 3: Checking GitHub remote..."
if git remote get-url origin > /dev/null 2>&1; then
    CURRENT_REMOTE=$(git remote get-url origin)
    if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
        print_warning "Remote origin exists but points to different URL"
        print_warning "Current: $CURRENT_REMOTE"
        print_warning "New: $REPO_URL"
        echo "Do you want to update the remote? (y/n)"
        read -p "Update remote? " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git remote set-url origin $REPO_URL
            print_success "Remote updated"
        fi
    else
        print_success "Remote is correctly configured"
    fi
else
    print_warning "No remote origin found. Adding it..."
    git remote add origin $REPO_URL
    print_success "Remote added"
fi

echo ""

# Step 4: Push to GitHub
print_status "Step 4: Pushing code to GitHub..."
print_warning "Make sure you have created the repository on GitHub first!"
echo "Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Set main branch
git branch -M main

# Push with error handling
if git push -u origin main; then
    print_success "Code pushed to GitHub successfully!"
else
    print_error "Failed to push to GitHub"
    print_error "Please check:"
    print_error "1. Repository exists on GitHub"
    print_error "2. You have push permissions"
    print_error "3. Repository URL is correct"
    exit 1
fi

echo ""

# Step 5: Instructions for GitHub Pages
print_status "Step 5: GitHub Pages Setup Instructions"
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    MANUAL STEPS REQUIRED                     ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║ 1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME     ║"
echo "║ 2. Click 'Settings' tab                                      ║"
echo "║ 3. Scroll down to 'Pages' section                            ║"
echo "║ 4. Under 'Source': Select 'Deploy from a branch'            ║"
echo "║ 5. Under 'Branch': Select 'main' and '/(root)'              ║"
echo "║ 6. Click 'Save'                                              ║"
echo "║ 7. Wait 1-3 minutes for deployment                           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

print_success "🎉 DEPLOYMENT SCRIPT COMPLETED!"
echo ""
print_success "Your website will be live at:"
echo "🌐 https://$GITHUB_USERNAME.github.io/$REPO_NAME/demo.html"
echo ""
print_success "Next steps:"
echo "1. Follow the manual GitHub Pages setup above"
echo "2. Wait for deployment (1-3 minutes)"
echo "3. Visit your live website!"
echo ""
print_success "Your beautiful Saudi AI Platform demo is ready! 🚀"
