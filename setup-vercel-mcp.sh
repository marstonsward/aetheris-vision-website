#!/bin/bash
#
# Setup script for Vercel MCP deployment monitoring
# Run this once to configure automatic Vercel monitoring on git push
#

set -e

# Auto-run setup if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo "🔧 Auto-executing Vercel MCP setup..."
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'  
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}🔧 [SETUP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ [SETUP]${NC} $1"
}

print_error() {
    echo -e "${RED}❌ [SETUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  [SETUP]${NC} $1"
}

# Configuration
WEBSITE_ROOT="/Users/marston.ward/Documents/GitHub/website"
MCP_DIR="$WEBSITE_ROOT/mcp"

print_status "Setting up Vercel MCP deployment monitoring..."

# Check if we're in the right directory
if [[ ! -d "$WEBSITE_ROOT" ]]; then
    print_error "Website directory not found: $WEBSITE_ROOT"
    exit 1
fi

cd "$WEBSITE_ROOT"

# Make scripts executable
print_status "Setting executable permissions..."
chmod +x push-with-vercel.sh 2>/dev/null || true
chmod +x .git/hooks/post-push 2>/dev/null || true

# Install MCP dependencies
print_status "Installing MCP dependencies..."
if [[ -f "$MCP_DIR/pyproject.toml" ]]; then
    cd "$MCP_DIR"
    pip install httpx pydantic mcp 2>/dev/null || {
        print_warning "Could not install Python dependencies automatically"
        print_status "Please run: pip install httpx pydantic mcp"
    }
    cd "$WEBSITE_ROOT"
fi

# Create git alias for enhanced push
print_status "Creating git alias 'pushv' for push-with-vercel..."
git config --local alias.pushv '!bash ./push-with-vercel.sh'

# Check if VERCEL_TOKEN is set
if [[ -z "$VERCEL_TOKEN" ]]; then
    print_warning "VERCEL_TOKEN environment variable not set"
    echo -e "${YELLOW}"
    echo "To enable automatic Vercel monitoring, please:"
    echo "1. Get your Vercel token from: https://vercel.com/account/tokens"
    echo "2. Add to your shell profile (~/.zshrc or ~/.bashrc):"
    echo "   export VERCEL_TOKEN=your_token_here"
    echo "3. Optionally set team ID if using Vercel teams:"
    echo "   export VERCEL_TEAM_ID=your_team_id"
    echo -e "${NC}"
else
    print_success "VERCEL_TOKEN is configured ✓"
fi

# Create usage instructions
cat << 'EOF' > VERCEL_MCP_USAGE.md
# Vercel MCP Deployment Monitoring

This setup provides automatic Vercel deployment monitoring when you push code.

## Usage Options

### Option 1: Enhanced Git Push (Recommended)
```bash
# Use the new git alias that includes Vercel monitoring
git pushv

# Or with specific arguments  
git pushv origin main
```

### Option 2: Direct Script
```bash
# Run the script directly
./push-with-vercel.sh

# With git push arguments
./push-with-vercel.sh origin production
```

### Option 3: Manual MCP Tools
```bash
# Check current deployment status
cd mcp && python vercel-server.py check_deployment_status

# Monitor deployment progress  
cd mcp && python vercel-server.py monitor_deployment
```

## Features

- 🚀 Automatic deployment monitoring after git push
- ✅ Real-time deployment status updates
- 📊 Build progress tracking with emoji indicators
- 🕐 Configurable timeout (default: 8 minutes)
- 🎯 Smart branch detection (main/production only)
- 🔗 Direct links to deployment URLs
- 📋 Detailed deployment logs on request

## GitHub Actions

The repository includes a GitHub Action (`.github/workflows/vercel-monitor.yml`) that automatically monitors deployments in CI/CD.

## Environment Variables

Set these in your shell profile:
```bash
export VERCEL_TOKEN=your_vercel_token_here
export VERCEL_TEAM_ID=your_team_id_here  # Optional, for team accounts
```

## MCP Configuration

The MCP server can be integrated with Claude Desktop by updating your Claude configuration with the settings from `mcp/claude-mcp-config.json`.

EOF

print_success "Setup completed!"
echo
print_status "📋 Usage summary:"
echo -e "${GREEN}  • Use: ${NC}git pushv${GREEN} for push with Vercel monitoring${NC}"
echo -e "${GREEN}  • Use: ${NC}./push-with-vercel.sh${GREEN} for direct script execution${NC}"
echo -e "${GREEN}  • Check: ${NC}VERCEL_MCP_USAGE.md${GREEN} for detailed instructions${NC}"

if [[ -z "$VERCEL_TOKEN" ]]; then
    echo
    print_warning "Don't forget to set your VERCEL_TOKEN environment variable!"
fi

print_success "🎉 Vercel MCP deployment monitoring is ready!"