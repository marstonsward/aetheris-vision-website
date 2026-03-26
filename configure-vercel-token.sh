#!/bin/bash
#
# Configure Vercel Token for Git + Vercel MCP
# Updates Claude Desktop settings with your Vercel API token
#

set -e

# Colors  
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}🔧 [TOKEN-CONFIG]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ [TOKEN-CONFIG]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  [TOKEN-CONFIG]${NC} $1"
}

print_error() {
    echo -e "${RED}❌ [TOKEN-CONFIG]${NC} $1"
}

CLAUDE_SETTINGS="/Users/marston.ward/.claude/settings.json"

print_status "Configuring Vercel token for Git + Vercel MCP integration..."

# Check if Claude settings file exists
if [[ ! -f "$CLAUDE_SETTINGS" ]]; then
    print_error "Claude Desktop settings file not found at: $CLAUDE_SETTINGS"
    print_status "Please ensure Claude Desktop is installed and has been run at least once."
    exit 1
fi

echo
echo -e "${BLUE}📋 Token Configuration Instructions:${NC}"
echo "1. Go to: https://vercel.com/account/tokens"
echo "2. Click 'Create Token'"
echo "3. Give it a name like 'Claude-MCP-Token'"  
echo "4. Select appropriate scope (usually 'Full Access')"
echo "5. Copy the generated token"
echo ""

# Prompt for Vercel token
read -p "Enter your Vercel API token: " vercel_token

if [[ -z "$vercel_token" ]]; then
    print_error "No token provided. Exiting."
    exit 1
fi

# Validate token format (basic check)
if [[ ${#vercel_token} -lt 20 ]]; then
    print_warning "Token seems unusually short. Are you sure it's correct?"
    read -p "Continue anyway? (y/N): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        print_status "Exiting. Please verify your token and try again."
        exit 1
    fi
fi

# Optional: Prompt for team ID
echo
read -p "Enter your Vercel Team ID (optional, press Enter to skip): " vercel_team_id

print_status "Updating Claude Desktop settings..."

# Create a backup
cp "$CLAUDE_SETTINGS" "${CLAUDE_SETTINGS}.backup"
print_status "Backup created: ${CLAUDE_SETTINGS}.backup"

# Update the settings file with the token
python3 << EOF
import json
import sys

try:
    with open('$CLAUDE_SETTINGS', 'r') as f:
        settings = json.load(f)
    
    # Update the Vercel token
    if 'mcpServers' in settings and 'git-vercel-deploy' in settings['mcpServers']:
        settings['mcpServers']['git-vercel-deploy']['env']['VERCEL_TOKEN'] = '$vercel_token'
        if '$vercel_team_id':
            settings['mcpServers']['git-vercel-deploy']['env']['VERCEL_TEAM_ID'] = '$vercel_team_id'
        
        with open('$CLAUDE_SETTINGS', 'w') as f:
            json.dump(settings, f, indent=2)
        
        print("✅ Settings updated successfully!")
    else:
        print("❌ Error: git-vercel-deploy MCP server not found in settings")
        print("   Please run setup-git-vercel-mcp.sh first")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF

update_result=$?

if [[ $update_result -eq 0 ]]; then
    print_success "Vercel token configured successfully!"
    
    # Also set environment variable for current session
    export VERCEL_TOKEN="$vercel_token"
    if [[ -n "$vercel_team_id" ]]; then
        export VERCEL_TEAM_ID="$vercel_team_id"
    fi
    
    echo
    print_status "🎯 Token Configuration Complete!"
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Restart Claude Desktop completely"
    echo "2. Test with: 'Check my git status' in Claude"
    echo "3. Deploy with: 'Push my code and monitor deployment'"
    echo ""
    
    print_status "🧪 Optional: Test now with:"
    echo "./test-git-vercel-mcp.sh"
    echo ""
    
    # Quick test of the token  
    print_status "Testing token validity..."
    cd "/Users/marston.ward/Documents/GitHub/website/mcp"
    
    test_result=$(python3 git-vercel-mcp.py check-deployment 2>&1 || true)
    
    if [[ $test_result == *"Latest Deployment Status"* ]]; then
        print_success "🎉 Token is working! Deployment data retrieved."
    elif [[ $test_result == *"No deployments found"* ]]; then
        print_success "🎉 Token is working! (No deployments found, but API access confirmed)"
    elif [[ $test_result == *"Error"* ]]; then
        print_warning "⚠️  Token configured but API test failed:"
        echo "   $test_result"
        print_status "This might be normal if you have no deployments yet"
    else
        print_status "Token configured. API test returned: $test_result"
    fi
    
    print_success "🚀 Your Git + Vercel MCP integration is ready!"
    
else
    print_error "Failed to update settings. Restoring backup..."
    cp "${CLAUDE_SETTINGS}.backup" "$CLAUDE_SETTINGS"
    print_status "Backup restored. Please check the error above and try again."
    exit 1
fi