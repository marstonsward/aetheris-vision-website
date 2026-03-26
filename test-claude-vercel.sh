#!/bin/bash
#
# Simple test script to verify Vercel MCP integration with Claude
# Run this after configuring your Vercel token
#

echo "🧪 Testing Vercel MCP Integration..."

# Test basic imports
python3 -c "
try:
    import httpx
    print('✅ httpx imported successfully')
except ImportError:
    print('❌ httpx not found - run: pip3 install httpx')
    exit(1)

try:
    import pydantic
    print('✅ pydantic imported successfully')
except ImportError:
    print('❌ pydantic not found - run: pip3 install pydantic')
    exit(1)

try:
    import mcp
    print('✅ mcp imported successfully')
except ImportError:
    print('❌ mcp not found - run: pip3 install mcp')
    exit(1)

print('🎉 All dependencies are installed!')
"

# Test Vercel token
if [[ -z "$VERCEL_TOKEN" ]]; then
    echo "⚠️  VERCEL_TOKEN environment variable not set"
    echo "   This is OK if you configured it in Claude Desktop settings"
else
    echo "✅ VERCEL_TOKEN environment variable is set"
fi

echo
echo "🔍 Claude Desktop Integration Status:"
if [[ -f "/Users/marston.ward/.claude/settings.json" ]]; then
    echo "✅ Claude Desktop settings file exists"
    if grep -q "vercel-deployment-monitor" "/Users/marston.ward/.claude/settings.json"; then
        echo "✅ Vercel MCP server is configured in Claude Desktop"
    else
        echo "❌ Vercel MCP server not found in Claude Desktop settings"
    fi
else
    echo "❌ Claude Desktop settings file not found"
fi

echo
echo "📋 Next Steps:"
echo "1. If dependencies are missing, run: pip3 install httpx pydantic mcp"
echo "2. Configure your Vercel token: ./configure-claude-vercel.sh"
echo "3. Restart Claude Desktop"
echo "4. Test by asking Claude: 'Check my Vercel deployment status'"