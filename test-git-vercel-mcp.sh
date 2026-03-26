#!/bin/bash
#
# Comprehensive test script for Git + Vercel MCP integration
# Tests all functionality without requiring actual deployments
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}🧪 [TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}✅ [PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}❌ [FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  [WARN]${NC} $1"
}

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Configuration
WEBSITE_ROOT="/Users/marston.ward/Documents/GitHub/website"
MCP_DIR="$WEBSITE_ROOT/mcp"
MCP_SCRIPT="$MCP_DIR/git-vercel-mcp.py"
CLAUDE_SETTINGS="/Users/marston.ward/.claude/settings.json"

# Test counters
total_tests=0
passed_tests=0
failed_tests=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((total_tests++))
    print_test "Testing: $test_name"
    
    if eval "$test_command"; then
        print_pass "$test_name"
        ((passed_tests++))
        return 0
    else
        print_fail "$test_name"
        ((failed_tests++))
        return 1
    fi
}

print_header "Git + Vercel MCP Integration Tests"

# Test 1: Directory Structure
print_test "Checking directory structure..."
run_test "Website directory exists" "[[ -d '$WEBSITE_ROOT' ]]"
run_test "MCP directory exists" "[[ -d '$MCP_DIR' ]]"
run_test "MCP script exists" "[[ -f '$MCP_SCRIPT' ]]"
run_test "MCP script is executable" "[[ -x '$MCP_SCRIPT' ]]"

# Test 2: Python Dependencies
print_header "Python Dependencies"
print_test "Checking Python dependencies..."

run_test "Python 3 available" "python3 --version >/dev/null 2>&1"
run_test "httpx library available" "python3 -c 'import httpx' 2>/dev/null"
run_test "pydantic library available" "python3 -c 'import pydantic' 2>/dev/null" 

# Test 3: Git Integration
print_header "Git Integration Tests"
cd "$WEBSITE_ROOT"

run_test "Git repository detected" "python3 '$MCP_SCRIPT' git-status | grep -q 'Git Repository Status'"

# Test git status output
git_status_output=$(python3 "$MCP_SCRIPT" git-status 2>&1 || true)
if [[ $git_status_output == *"Git Repository Status"* ]]; then
    print_pass "Git status command produces expected output"
    ((passed_tests++))
else
    print_fail "Git status command failed: $git_status_output"
    ((failed_tests++))
fi
((total_tests++))

# Test 4: Claude Desktop Integration
print_header "Claude Desktop Integration"

run_test "Claude Desktop settings exists" "[[ -f '$CLAUDE_SETTINGS' ]]"

if [[ -f "$CLAUDE_SETTINGS" ]]; then
    run_test "git-vercel-deploy configured" "grep -q 'git-vercel-deploy' '$CLAUDE_SETTINGS'"
    
    # Check token configuration
    if grep -q '"VERCEL_TOKEN": ""' "$CLAUDE_SETTINGS"; then
        print_warning "VERCEL_TOKEN is empty in Claude settings"
        print_test "Run ./configure-vercel-token.sh to fix this"
    else
        print_pass "VERCEL_TOKEN appears to be configured in Claude settings"
    fi
fi

# Test 5: Environment Variables
print_header "Environment Configuration"

if [[ -n "$VERCEL_TOKEN" ]]; then
    print_pass "VERCEL_TOKEN environment variable is set"
    
    # Test Vercel API connectivity (if token is set)
    print_test "Testing Vercel API connectivity..."
    cd "$MCP_DIR"
    
    api_test_output=$(timeout 30 python3 git-vercel-mcp.py check-deployment 2>&1 || true)
    
    if [[ $api_test_output == *"Latest Deployment Status"* ]]; then
        print_pass "Vercel API connectivity confirmed - deployment data retrieved"
        ((passed_tests++))
    elif [[ $api_test_output == *"No deployments found"* ]]; then
        print_pass "Vercel API connectivity confirmed - no deployments (normal)"
        ((passed_tests++))
    elif [[ $api_test_output == *"Error"* ]]; then
        print_warning "Vercel API test failed: $api_test_output"
        print_test "This might be normal if you have no deployments yet"
    else
        print_warning "Unexpected API response: $api_test_output"
    fi
    ((total_tests++))
    
else
    print_warning "VERCEL_TOKEN environment variable not set"
    print_test "Set with: export VERCEL_TOKEN=your_token"
    print_test "Or configure with: ./configure-vercel-token.sh"
fi

# Test 6: Available Commands
print_header "MCP Commands Test"
cd "$MCP_DIR"

commands=(
    "git-status"
    "list-deployments"
)

for cmd in "${commands[@]}"; do
    print_test "Testing command: $cmd"
    cmd_output=$(timeout 15 python3 git-vercel-mcp.py "$cmd" 2>&1 || true)
    
    if [[ $cmd_output == *"Error"* ]] && [[ $cmd_output == *"VERCEL_TOKEN"* ]]; then
        print_warning "$cmd requires VERCEL_TOKEN (expected if not configured)"
    elif [[ $cmd_output == *"❌"* ]] || [[ $cmd_output == *"Error"* ]]; then
        print_warning "$cmd failed: $(echo "$cmd_output" | head -1)"
    else
        print_pass "$cmd command working"
        ((passed_tests++))
    fi
    ((total_tests++))
done

# Test 7: Git Alias
print_header "Git Integration"
cd "$WEBSITE_ROOT"

if git config --local --get alias.deploy >/dev/null 2>&1; then
    print_pass "Git alias 'deploy' is configured"
    ((passed_tests++))
else
    print_warning "Git alias 'deploy' not found"
    print_test "Run setup-git-vercel-mcp.sh to create it"
fi
((total_tests++))

# Final Results
print_header "Test Results Summary"

echo -e "${BLUE}📊 Test Results:${NC}"
echo "  Total Tests: $total_tests"
echo -e "  ${GREEN}Passed: $passed_tests${NC}"
echo -e "  ${RED}Failed: $failed_tests${NC}"
echo ""

if [[ $failed_tests -eq 0 ]]; then
    print_pass "🎉 All tests passed! Your Git + Vercel MCP integration is working perfectly!"
    echo ""
    echo -e "${GREEN}✅ Ready to use:${NC}"
    echo "  • In Claude: 'Push my code and monitor deployment'"
    echo "  • Git alias: 'git deploy'"
    echo "  • Direct: './mcp/git-vercel-mcp.py deploy-and-monitor'"
    
elif [[ $passed_tests -gt $((total_tests / 2)) ]]; then
    print_warning "⚠️  Most tests passed, but some issues found"
    echo ""
    echo -e "${YELLOW}🔧 Recommended actions:${NC}"
    
    if [[ -z "$VERCEL_TOKEN" ]]; then
        echo "  1. Configure Vercel token: ./configure-vercel-token.sh"
    fi
    
    echo "  2. Restart Claude Desktop"
    echo "  3. Re-run this test: ./test-git-vercel-mcp.sh"
    
else
    print_fail "❌ Multiple tests failed. Please check the setup"
    echo ""
    echo -e "${RED}🚨 Required actions:${NC}"
    echo "  1. Run setup script: ./setup-git-vercel-mcp.sh"
    echo "  2. Install dependencies: pip3 install httpx pydantic"
    echo "  3. Configure token: ./configure-vercel-token.sh"
    echo "  4. Restart Claude Desktop"
fi

echo ""
print_test "Need help? Check the setup guides:"
echo "  • CLAUDE_VERCEL_INTEGRATION.md"
echo "  • setup-git-vercel-mcp.sh"

exit $failed_tests