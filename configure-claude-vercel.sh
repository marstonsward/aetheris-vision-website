#!/bin/bash
#
# Configure Vercel Token for Claude Desktop Integration
# This script updates your Claude Desktop settings with your Vercel token
#

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}🔧 [CLAUDE-VERCEL]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ [CLAUDE-VERCEL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  [CLAUDE-VERCEL]${NC} $1"
}

print_error() {
    echo -e "${RED}❌ [CLAUDE-VERCEL]${NC} $1"
}

CLAUDE_SETTINGS="/Users/marston.ward/.claude/settings.json"

print_status "Configuring Vercel token for Claude Desktop integration..."

# Check if Claude settings file exists
if [[ ! -f "$CLAUDE_SETTINGS" ]]; then
    print_error "Claude Desktop settings file not found at: $CLAUDE_SETTINGS"
    print_status "Please ensure Claude Desktop is installed and has been run at least once."
    exit 1
fi

# Prompt for Vercel token
echo
echo -e "${BLUE}Please provide your Vercel token:${NC}"
echo "1. Go to: https://vercel.com/account/tokens"
echo "2. Create a new token with appropriate permissions"
echo "3. Copy the token and paste it below"
echo
read -p "Enter your Vercel token: " vercel_token

if [[ -z "$vercel_token" ]]; then
    print_error "No token provided. Exiting."
    exit 1
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
    if 'mcpServers' in settings and 'vercel-deployment-monitor' in settings['mcpServers']:
        settings['mcpServers']['vercel-deployment-monitor']['env']['VERCEL_TOKEN'] = '$vercel_token'
        if '$vercel_team_id':
            settings['mcpServers']['vercel-deployment-monitor']['env']['VERCEL_TEAM_ID'] = '$vercel_team_id'
        
        with open('$CLAUDE_SETTINGS', 'w') as f:
            json.dump(settings, f, indent=2)
        
        print("Settings updated successfully!")
    else:
        print("Error: Vercel MCP server not found in settings")
        sys.exit(1)
        
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
EOF

if [[ $? -eq 0 ]]; then
    print_success "Vercel token configured successfully!"
    echo
    print_status "📋 Next steps:"
    echo -e "${GREEN}1. Restart Claude Desktop${NC}"
    echo -e "${GREEN}2. Test the integration by asking: 'Check my Vercel deployment status'${NC}"
    echo -e "${GREEN}3. Available commands in Claude:${NC}"
    echo "   • Check deployment status"
    echo "   • Monitor deployment progress"
    echo "   • Get deployment logs"
    echo "   • List recent deployments"
    echo
    print_success "🎉 Claude-Vercel integration is ready!"
else
    print_error "Failed to update settings. Restoring backup..."
    cp "${CLAUDE_SETTINGS}.backup" "$CLAUDE_SETTINGS"
fi