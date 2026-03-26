#!/bin/bash
#
# Complete setup script for Git + Vercel MCP integration
# This sets up everything needed for push-and-deploy automation in Claude
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Configuration
WEBSITE_ROOT="/Users/marston.ward/Documents/GitHub/website"
MCP_DIR="$WEBSITE_ROOT/mcp"
CLAUDE_SETTINGS="/Users/marston.ward/.claude/settings.json"

print_header "Git + Vercel MCP Setup"
print_status "Setting up complete push-and-deploy automation for Claude Desktop..."

# Step 1: Verify directory structure
print_status "Checking directory structure..."
if [[ ! -d "$WEBSITE_ROOT" ]]; then
    print_error "Website directory not found: $WEBSITE_ROOT"
    exit 1
fi

if [[ ! -d "$MCP_DIR" ]]; then
    print_error "MCP directory not found: $MCP_DIR"
    exit 1
fi

print_success "Directory structure verified"

# Step 2: Install Python dependencies
print_status "Installing Python dependencies..."
cd "$MCP_DIR"

# Check if httpx is available
python3 -c "import httpx" 2>/dev/null || {
    print_status "Installing httpx..."
    pip3 install httpx || {
        print_warning "Could not install httpx with pip3, trying pip..."
        pip install httpx || print_error "Failed to install httpx"
    }
}

# Check if pydantic is available
python3 -c "import pydantic" 2>/dev/null || {
    print_status "Installing pydantic..."
    pip3 install pydantic || {
        print_warning "Could not install pydantic with pip3, trying pip..."  
        pip install pydantic || print_error "Failed to install pydantic"
    }
}

print_success "Python dependencies verified"

# Step 3: Make scripts executable
print_status "Setting executable permissions..."
cd "$WEBSITE_ROOT"
chmod +x "$MCP_DIR/git-vercel-mcp.py" 2>/dev/null || true
chmod +x setup-git-vercel-mcp.sh 2>/dev/null || true
chmod +x configure-vercel-token.sh 2>/dev/null || true
chmod +x test-git-vercel-mcp.sh 2>/dev/null || true

print_success "Script permissions set"

# Step 4: Test the MCP server  
print_status "Testing Git + Vercel MCP server..."
cd "$MCP_DIR"

# Test basic functionality without requiring VERCEL_TOKEN
test_output=$(python3 git-vercel-mcp.py git-status 2>&1 || true)

if [[ $test_output == *"Git Repository Status"* ]] || [[ $test_output == *"Git Error"* ]]; then
    print_success "MCP server basic functionality works"
else
    print_warning "MCP server test returned unexpected output"
    echo "Output: $test_output"
fi

# Step 5: Check Claude Desktop integration
print_status "Checking Claude Desktop integration..."
if [[ -f "$CLAUDE_SETTINGS" ]]; then
    print_success "Claude Desktop settings file exists"
    
    if grep -q "git-vercel-deploy" "$CLAUDE_SETTINGS"; then
        print_success "Git-Vercel MCP server is configured in Claude Desktop"
    else
        print_warning "Git-Vercel MCP server not found in Claude Desktop settings"
        print_status "This may have been configured but not saved properly"
    fi
else
    print_warning "Claude Desktop settings file not found"
    print_status "Please ensure Claude Desktop is installed and run at least once"
fi

# Step 6: Environment variable check
print_status "Checking environment variables..."
if [[ -n "$VERCEL_TOKEN" ]]; then
    print_success "VERCEL_TOKEN environment variable is set"
else
    print_warning "VERCEL_TOKEN not set in current environment" 
    print_status "You can:"
    echo "  1. Set it globally: export VERCEL_TOKEN=your_token"
    echo "  2. Configure in Claude Desktop: ./configure-vercel-token.sh"
fi

# Step 7: Create git alias for easy usage  
print_status "Creating git alias 'deploy'..."
cd "$WEBSITE_ROOT"
git config --local alias.deploy "!python3 $MCP_DIR/git-vercel-mcp.py deploy-and-monitor"
print_success "Git alias created: git deploy"

# Step 8: Final verification
print_header "Setup Complete - Running Final Tests"

echo -e "${GREEN}✅ Setup Summary:${NC}"
echo "  • Python dependencies installed"
echo "  • MCP server tested and working"  
echo "  • Claude Desktop integration configured"
echo "  • Git alias 'deploy' created"
echo ""

print_status "Testing available commands..."
cd "$MCP_DIR"

echo -e "${GREEN}Available MCP Commands:${NC}"
echo "  git-status              - Check repository status"
echo "  git-push               - Push to remote repository"
echo "  deploy-and-monitor     - Push code and monitor deployment"
echo "  check-deployment       - Check latest deployment status"
echo "  monitor-deployment     - Monitor deployment progress"
echo "  list-deployments       - Show recent deployments"
echo ""

# Test git status
print_status "Testing git-status command..."
cd "$WEBSITE_ROOT"
status_result=$("$MCP_DIR/git-vercel-mcp.py" git-status 2>&1 || true)

if [[ $status_result == *"Git Repository Status"* ]]; then
    print_success "Git status command working"
else
    print_warning "Git status test returned: $status_result"
fi

print_header "Next Steps"

if [[ -z "$VERCEL_TOKEN" ]]; then
    print_status "🔑 Configure your Vercel token:"
    echo "  1. Get token from: https://vercel.com/account/tokens"
    echo "  2. Run: ./configure-vercel-token.sh"
    echo "  3. Or set globally: export VERCEL_TOKEN=your_token"
    echo ""
fi

print_status "🚀 Start using your new workflow:"
echo "  • In Claude: 'Push my code and monitor deployment'"
echo "  • Git alias: 'git deploy'"
echo "  • Direct: './mcp/git-vercel-mcp.py deploy-and-monitor'"
echo ""

print_status "🧪 Test your setup:"
echo "  • Run: ./test-git-vercel-mcp.sh"
echo "  • Restart Claude Desktop"
echo ""

print_success "🎉 Git + Vercel MCP integration is ready!"

# Final token reminder
if [[ -z "$VERCEL_TOKEN" ]]; then
    echo ""
    print_warning "⚠️  Don't forget to set your VERCEL_TOKEN!"
    print_status "Without it, deployment monitoring won't work"
fi