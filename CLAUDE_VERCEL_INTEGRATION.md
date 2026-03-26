# Claude Desktop + Vercel MCP Integration

✅ **INTEGRATION CONFIGURED** - Your Vercel MCP server is now registered with Claude Desktop!

## 🔧 Complete Setup Steps

### 1. Install Python Dependencies
```bash
pip3 install httpx pydantic mcp
```

### 2. Configure Your Vercel Token
```bash
chmod +x configure-claude-vercel.sh
./configure-claude-vercel.sh
```
*This will prompt you for your Vercel token from https://vercel.com/account/tokens*

### 3. Restart Claude Desktop
Close and reopen Claude Desktop to load the new MCP server.

### 4. Test the Integration
Ask Claude any of these commands:
- "Check my Vercel deployment status"
- "Monitor my latest deployment"  
- "Show me recent deployments"
- "Get deployment logs for [deployment-id]"

## 🛠️ Available MCP Tools

| Tool | Description | Example Usage |
|------|-------------|---------------|
| `check_deployment_status` | Get current deployment info | "What's the status of my latest deployment?" |
| `monitor_deployment` | Watch deployment until complete | "Monitor my deployment progress" |
| `get_deployment_logs` | Retrieve build logs | "Show me the logs for deployment xyz123" |
| `list_recent_deployments` | Show deployment history | "List my recent deployments" |

## 🔍 Verify Setup

Run the test script:
```bash
chmod +x test-claude-vercel.sh
./test-claude-vercel.sh
```

## 📋 What's Been Configured

✅ **MCP Server Added**: `vercel-deployment-monitor` registered in Claude Desktop  
✅ **Environment Setup**: Configured to use your Vercel token securely  
✅ **Tool Integration**: 4 deployment monitoring tools available  
✅ **Existing Preserved**: Your existing `esmai-weather` MCP server unchanged  

## 🎯 Example Claude Conversations

Once configured, you can have conversations like:

**You**: "Check my website deployment status"  
**Claude**: *Uses `check_deployment_status` tool and shows real-time status*

**You**: "Monitor my deployment until it's ready"  
**Claude**: *Uses `monitor_deployment` tool and provides live updates*

**You**: "Something went wrong, show me the build logs"  
**Claude**: *Uses `get_deployment_logs` to help debug issues*

## 🔧 Troubleshooting

If tools don't appear:
1. Verify dependencies: `./test-claude-vercel.sh`
2. Check token configuration: Look for `VERCEL_TOKEN` in `~/.claude/settings.json`
3. Restart Claude Desktop completely
4. Try asking: "What MCP tools are available?"

**Your Vercel deployments are now integrated directly into Claude conversations! 🚀**