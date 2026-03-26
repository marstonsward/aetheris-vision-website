#!/bin/bash
#
# Vercel-enabled git push wrapper
# Usage: ./push-with-vercel.sh [git-push-arguments]
# This script pushes to git and automatically monitors the Vercel deployment
#

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VERCEL_PROJECT_NAME="website"
MONITOR_TIMEOUT_MINUTES=8
MCP_SCRIPT_PATH="/Users/marston.ward/Documents/GitHub/website/mcp/vercel-server.py"

# Function to print colored output
print_status() {
    echo -e "${BLUE}🚀 [PUSH+VERCEL]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ [PUSH+VERCEL]${NC} $1"
}

print_error() {
    echo -e "${RED}❌ [PUSH+VERCEL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  [PUSH+VERCEL]${NC} $1"
}

# Parse arguments
git_args="$*"
if [[ -z "$git_args" ]]; then
    git_args="origin main"
fi

print_status "Starting enhanced git push with Vercel monitoring..."
print_status "Git command: git push $git_args"

# Perform the git push
echo -e "${BLUE}━━━━━━━━━━━━━ GIT PUSH ━━━━━━━━━━━━━${NC}"
git push $git_args
push_exit_code=$?

if [[ $push_exit_code -ne 0 ]]; then
    print_error "Git push failed with exit code $push_exit_code"
    exit $push_exit_code
fi

print_success "Git push completed successfully!"

# Check if we're pushing to a monitored branch
current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)
if [[ "$current_branch" != "main" && "$current_branch" != "production" ]]; then
    print_warning "Skipping Vercel monitoring - not on main or production branch (current: $current_branch)"
    exit 0
fi

# Check if VERCEL_TOKEN is set
if [[ -z "$VERCEL_TOKEN" ]]; then
    print_error "VERCEL_TOKEN environment variable not set"
    print_status "Please set your Vercel token: export VERCEL_TOKEN=your_token_here"
    exit 1
fi

echo -e "${BLUE}━━━━━━━━━━━━ VERCEL MONITORING ━━━━━━━━━━━━${NC}"
print_status "Vercel monitoring starting for branch: $current_branch"
print_status "Waiting 15 seconds for deployment to initialize..."
sleep 15

# Check if MCP script exists
if [[ ! -f "$MCP_SCRIPT_PATH" ]]; then
    print_error "MCP script not found at: $MCP_SCRIPT_PATH"
    print_status "Please ensure the Vercel MCP server is properly installed"
    exit 1
fi

# Run deployment status check
print_status "Checking current deployment status..."
cd "$(dirname "$MCP_SCRIPT_PATH")" || exit 1

python3 -c "
import asyncio
import sys
import os
sys.path.append('$(dirname "$MCP_SCRIPT_PATH")')

# Import the functions we need
exec(open('$MCP_SCRIPT_PATH').read())

async def main():
    try:
        global vercel_client
        vercel_client = VercelClient()
        result = await check_current_deployment_status('$VERCEL_PROJECT_NAME')
        print(result)
        return True
    except Exception as e:
        print(f'Error: {e}')
        return False
        
success = asyncio.run(main())
exit(0 if success else 1)
"

deployment_check_exit_code=$?

if [[ $deployment_check_exit_code -eq 0 ]]; then
    print_success "Deployment status retrieved"
else
    print_error "Failed to check deployment status"
fi

# Start monitoring deployment progress
print_status "Monitoring deployment progress (timeout: ${MONITOR_TIMEOUT_MINUTES}m)..."
print_status "Press Ctrl+C anytime to stop monitoring and continue"

python3 -c "
import asyncio
import sys
import os
sys.path.append('$(dirname "$MCP_SCRIPT_PATH")')

# Import the functions we need
exec(open('$MCP_SCRIPT_PATH').read())

async def main():
    try:
        global vercel_client
        vercel_client = VercelClient()
        result = await monitor_latest_deployment('$VERCEL_PROJECT_NAME', $MONITOR_TIMEOUT_MINUTES)
        print(result)
        return True
    except KeyboardInterrupt:
        print('\n⏹️  Monitoring stopped by user')
        return True
    except Exception as e:
        print(f'Error monitoring deployment: {e}')
        return False
        
success = asyncio.run(main())
exit(0 if success else 1)
"

monitor_exit_code=$?

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [[ $monitor_exit_code -eq 0 ]]; then
    print_success "Deployment monitoring completed!"
    print_status "🎉 Your changes are now live on Vercel!"
else
    print_warning "Deployment monitoring ended with issues"
    print_status "Check Vercel dashboard: https://vercel.com/dashboard"
fi

print_success "Push with Vercel monitoring completed!"