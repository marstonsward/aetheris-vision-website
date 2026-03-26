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

