#!/usr/bin/env python3
"""
Git + Vercel MCP Server for deployment automation and monitoring.
Self-contained server that handles git operations and Vercel deployment monitoring.

Usage:
    python git-vercel-mcp.py <command> [args]

Commands:
    git-status              - Show git repository status
    git-push [remote] [branch]  - Push code to git repository  
    deploy-and-monitor      - Push code and monitor Vercel deployment
    check-deployment        - Check current Vercel deployment status
    monitor-deployment      - Monitor deployment progress
    list-deployments [limit] - List recent deployments
    get-logs <deployment-id> - Get deployment logs

Environment Variables:
    VERCEL_TOKEN    - Required: Your Vercel API token
    VERCEL_TEAM_ID  - Optional: Your Vercel team ID
"""

import asyncio
import json
import os
import sys
import subprocess
from typing import Any, Dict, List, Optional, Union
import time
from datetime import datetime
import logging

try:
    import httpx
except ImportError:
    print("❌ Error: httpx not installed. Run: pip3 install httpx")
    sys.exit(1)

try:
    from pydantic import BaseModel
except ImportError:
    print("❌ Error: pydantic not installed. Run: pip3 install pydantic") 
    sys.exit(1)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class GitRepository:
    def __init__(self, repo_path: str = "."):
        self.repo_path = os.path.abspath(repo_path)
        
    def run_git_command(self, command: List[str]) -> tuple[str, str, int]:
        """Run a git command and return stdout, stderr, exit_code"""
        try:
            result = subprocess.run(
                ["git"] + command,
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                timeout=60
            )
            return result.stdout.strip(), result.stderr.strip(), result.returncode
        except subprocess.TimeoutExpired:
            return "", "Command timed out", 1
        except Exception as e:
            return "", str(e), 1

    def get_status(self) -> Dict[str, Any]:
        """Get comprehensive git repository status"""
        status = {}
        
        # Basic status
        stdout, stderr, code = self.run_git_command(["status", "--porcelain"])
        if code == 0:
            status["has_changes"] = len(stdout.strip()) > 0
            status["changes"] = stdout.strip().split('\n') if stdout.strip() else []
        else:
            status["error"] = stderr
            return status
            
        # Current branch
        stdout, _, code = self.run_git_command(["branch", "--show-current"])
        if code == 0:
            status["current_branch"] = stdout
        
        # Remote tracking
        stdout, _, code = self.run_git_command(["status", "-b", "--porcelain"])
        if code == 0 and stdout:
            first_line = stdout.split('\n')[0]
            if '[ahead' in first_line:
                status["ahead"] = True
            if '[behind' in first_line:
                status["behind"] = True
                
        # Last commit
        stdout, _, code = self.run_git_command(["log", "-1", "--oneline"])
        if code == 0:
            status["last_commit"] = stdout
            
        return status
    
    def push(self, remote: str = "origin", branch: Optional[str] = None) -> Dict[str, Any]:
        """Push changes to remote repository"""
        if branch is None:
            # Get current branch
            stdout, stderr, code = self.run_git_command(["branch", "--show-current"])
            if code != 0:
                return {"success": False, "error": "Could not determine current branch"}
            branch = stdout
        
        logger.info(f"Pushing {branch} to {remote}...")
        stdout, stderr, code = self.run_git_command(["push", remote, branch])
        
        return {
            "success": code == 0,
            "stdout": stdout,
            "stderr": stderr,
            "remote": remote,
            "branch": branch
        }

class VercelDeployment(BaseModel):
    uid: str
    url: str
    name: str
    state: str
    type: str
    created: int
    ready: Optional[int] = None
    building_at: Optional[int] = None
    meta: Dict[str, Any] = {}
    target: Optional[str] = None

class VercelClient:
    def __init__(self, token: Optional[str] = None, team_id: Optional[str] = None):
        self.token = token or os.getenv('VERCEL_TOKEN')
        self.team_id = team_id or os.getenv('VERCEL_TEAM_ID')
        self.base_url = "https://api.vercel.com"
        
        if not self.token:
            raise ValueError("VERCEL_TOKEN environment variable is required")

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        if self.team_id:
            headers["X-Vercel-Team-Id"] = self.team_id
        return headers

    async def get_deployments(self, project_name: Optional[str] = None, limit: int = 10) -> List[VercelDeployment]:
        """Get recent deployments for a project or all projects"""
        async with httpx.AsyncClient() as client:
            params = {"limit": str(limit)}
            if project_name:
                params["app"] = project_name
                
            response = await client.get(
                f"{self.base_url}/v6/deployments",
                headers=self._get_headers(),
                params=params
            )
            response.raise_for_status()
            data = response.json()
            
            deployments = []
            for deployment in data.get('deployments', []):
                deployments.append(VercelDeployment(**deployment))
            
            return deployments

    async def get_deployment_by_id(self, deployment_id: str) -> Optional[VercelDeployment]:
        """Get specific deployment details"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/v13/deployments/{deployment_id}",
                headers=self._get_headers()
            )
            
            if response.status_code == 404:
                return None
            
            response.raise_for_status()
            data = response.json()
            return VercelDeployment(**data)

    async def get_deployment_logs(self, deployment_id: str) -> List[Dict[str, Any]]:
        """Get build logs for a deployment"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/v3/deployments/{deployment_id}/events",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()

# Utility functions
def format_timestamp(timestamp: Optional[int]) -> str:
    """Format Unix timestamp to readable string"""
    if not timestamp:
        return "N/A"
    return datetime.fromtimestamp(timestamp / 1000).strftime("%Y-%m-%d %H:%M:%S")

def get_deployment_status_emoji(state: str) -> str:
    """Get emoji for deployment state"""
    status_map = {
        "BUILDING": "🔨",
        "ERROR": "❌", 
        "INITIALIZING": "🚀",
        "QUEUED": "⏳",
        "READY": "✅",
        "CANCELED": "🚫"
    }
    return status_map.get(state, "❓")

# Command implementations
async def cmd_git_status(repo_path: str = ".") -> str:
    """Show git repository status"""
    repo = GitRepository(repo_path)
    status = repo.get_status()
    
    if "error" in status:
        return f"❌ **Git Error**: {status['error']}"
    
    result = ["📋 **Git Repository Status**", ""]
    result.append(f"🌿 **Branch**: {status.get('current_branch', 'unknown')}")
    
    if status.get("last_commit"):
        result.append(f"📝 **Last Commit**: {status['last_commit']}")
    
    if status.get("has_changes"):
        result.append(f"📊 **Changes**: {len(status.get('changes', []))} files modified")
        for change in status.get('changes', []):
            result.append(f"   {change}")
    else:
        result.append("✨ **Status**: Working directory clean")
        
    if status.get("ahead"):
        result.append("⬆️ **Status**: Ahead of remote (ready to push)")
    if status.get("behind"):
        result.append("⬇️ **Status**: Behind remote (pull needed)")
        
    return "\n".join(result)

async def cmd_git_push(remote: str = "origin", branch: Optional[str] = None, repo_path: str = ".") -> str:
    """Push changes to git repository"""
    repo = GitRepository(repo_path)
    
    # First check status
    status = repo.get_status()
    if "error" in status:
        return f"❌ **Git Error**: {status['error']}"
    
    # Perform push
    push_result = repo.push(remote, branch)
    
    result = ["🚀 **Git Push Results**", ""]
    
    if push_result["success"]:
        result.append(f"✅ **Success**: Pushed {push_result['branch']} to {push_result['remote']}")
        if push_result["stdout"]:
            result.append(f"📤 **Output**: {push_result['stdout']}")
    else:
        result.append(f"❌ **Failed**: Push to {push_result['remote']} failed")
        if push_result["stderr"]:
            result.append(f"🚨 **Error**: {push_result['stderr']}")
            
    return "\n".join(result)

async def cmd_check_deployment(project_name: str = "website") -> str:
    """Check current Vercel deployment status"""
    try:
        client = VercelClient()
        deployments = await client.get_deployments(project_name=project_name, limit=1)
        
        if not deployments:
            return f"No deployments found for project: {project_name}"
        
        deployment = deployments[0]
        emoji = get_deployment_status_emoji(deployment.state)
        
        result = [f"🚀 **Latest Deployment Status** ({project_name})", ""]
        result.append(f"{emoji} **Status**: {deployment.state}")
        result.append(f"🔗 **URL**: https://{deployment.url}")
        result.append(f"📦 **Name**: {deployment.name}")
        result.append(f"🕐 **Created**: {format_timestamp(deployment.created)}")
        result.append(f"⚡ **Type**: {deployment.type}")
        result.append(f"📋 **ID**: {deployment.uid}")
        
        if deployment.ready:
            result.append(f"✅ **Ready At**: {format_timestamp(deployment.ready)}")
        
        if deployment.building_at:
            result.append(f"🔨 **Building At**: {format_timestamp(deployment.building_at)}")
            
        return "\n".join(result)
        
    except Exception as e:
        logger.error(f"Error checking deployment: {e}")
        return f"❌ **Error**: {str(e)}"

async def cmd_monitor_deployment(project_name: str = "website", timeout_minutes: int = 10) -> str:
    """Monitor deployment until completion"""
    try:
        client = VercelClient()
        deployments = await client.get_deployments(project_name=project_name, limit=1)
        
        if not deployments:
            return f"No deployments found for project: {project_name}"
        
        deployment = deployments[0]
        deployment_id = deployment.uid
        
        result = [f"🔍 **Monitoring Deployment**: {deployment_id}", ""]
        
        start_time = datetime.now()
        timeout_seconds = timeout_minutes * 60
        
        while True:
            elapsed = (datetime.now() - start_time).total_seconds()
            if elapsed > timeout_seconds:
                result.append(f"⏰ **Timeout**: Monitoring stopped after {timeout_minutes} minutes")
                break
            
            current_deployment = await client.get_deployment_by_id(deployment_id)
            
            if not current_deployment:
                result.append("❌ **Error**: Deployment not found")
                break
            
            emoji = get_deployment_status_emoji(current_deployment.state)
            timestamp = datetime.now().strftime("%H:%M:%S")
            result.append(f"{emoji} **{timestamp}**: {current_deployment.state}")
            
            if current_deployment.state in ["READY", "ERROR", "CANCELED"]:
                if current_deployment.state == "READY":
                    result.append(f"✅ **Deployment Complete!** Visit: https://{current_deployment.url}")
                else:
                    result.append(f"❌ **Deployment Failed**: {current_deployment.state}")
                break
            
            await asyncio.sleep(10)
        
        return "\n".join(result)
        
    except Exception as e:
        logger.error(f"Error monitoring deployment: {e}")
        return f"❌ **Error**: {str(e)}"

async def cmd_deploy_and_monitor(remote: str = "origin", branch: Optional[str] = None, project_name: str = "website", repo_path: str = ".") -> str:
    """Push code and monitor Vercel deployment"""
    result = ["🚀 **Deploy and Monitor: Complete Git + Vercel Workflow**", ""]
    
    # Step 1: Git push
    result.append("📤 **Step 1: Pushing to Git**")
    push_result = await cmd_git_push(remote, branch, repo_path)
    result.append(push_result)
    result.append("")
    
    # Check if push was successful
    if "✅ **Success**" not in push_result:
        result.append("❌ **Workflow Stopped**: Git push failed")
        return "\n".join(result)
    
    # Step 2: Wait for Vercel to start
    result.append("⏳ **Step 2: Waiting for Vercel deployment to initialize** (20 seconds)")
    await asyncio.sleep(20)
    result.append("")
    
    # Step 3: Check deployment status
    result.append("📊 **Step 3: Checking Deployment Status**")
    status_result = await cmd_check_deployment(project_name)
    result.append(status_result)
    result.append("")
    
    # Step 4: Monitor deployment
    result.append("👁️ **Step 4: Monitoring Deployment Progress**")
    monitor_result = await cmd_monitor_deployment(project_name, timeout_minutes=8)
    result.append(monitor_result)
    
    return "\n".join(result)

async def cmd_list_deployments(project_name: str = "website", limit: int = 5) -> str:
    """List recent deployments"""
    try:
        client = VercelClient()
        deployments = await client.get_deployments(project_name=project_name, limit=limit)
        
        if not deployments:
            return f"No deployments found for project: {project_name}"
        
        result = [f"📦 **Recent Deployments for {project_name}**", ""]
        
        for i, deployment in enumerate(deployments, 1):
            emoji = get_deployment_status_emoji(deployment.state)
            result.append(f"{i}. {emoji} **{deployment.name}** ({deployment.state})")
            result.append(f"   🔗 https://{deployment.url}")
            result.append(f"   🕐 {format_timestamp(deployment.created)}")
            result.append(f"   📋 ID: {deployment.uid}")
            result.append("")
            
        return "\n".join(result)
        
    except Exception as e:
        logger.error(f"Error listing deployments: {e}")
        return f"❌ **Error**: {str(e)}"

async def cmd_get_logs(deployment_id: str) -> str:
    """Get deployment logs"""
    try:
        client = VercelClient()
        logs = await client.get_deployment_logs(deployment_id)
        
        if not logs:
            return f"No logs available for deployment: {deployment_id}"
        
        result = [f"📋 **Deployment Logs for {deployment_id}**", ""]
        
        for log_entry in logs:
            timestamp = format_timestamp(log_entry.get('created'))
            log_type = log_entry.get('type', 'info').upper()
            message = log_entry.get('payload', {}).get('text', str(log_entry))
            
            emoji_map = {
                'STDOUT': '📤',
                'STDERR': '❌', 
                'INFO': 'ℹ️',
                'ERROR': '🚨'
            }
            emoji = emoji_map.get(log_type, '📝')
            
            result.append(f"{emoji} **{timestamp}** [{log_type}]: {message}")
        
        return "\n".join(result)
        
    except Exception as e:
        logger.error(f"Error fetching logs: {e}")
        return f"❌ **Error**: {str(e)}"

# MCP Server Interface (simplified for direct usage)
async def handle_mcp_request(tool_name: str, arguments: Dict[str, Any]) -> str:
    """Handle MCP-style tool requests"""
    try:
        if tool_name == "git_status":
            return await cmd_git_status(arguments.get("repo_path", "."))
            
        elif tool_name == "git_push":
            return await cmd_git_push(
                arguments.get("remote", "origin"),
                arguments.get("branch"),
                arguments.get("repo_path", ".")
            )
            
        elif tool_name == "deploy_and_monitor":
            return await cmd_deploy_and_monitor(
                arguments.get("remote", "origin"),
                arguments.get("branch"),
                arguments.get("project_name", "website"),
                arguments.get("repo_path", ".")
            )
            
        elif tool_name == "check_deployment":
            return await cmd_check_deployment(arguments.get("project_name", "website"))
            
        elif tool_name == "monitor_deployment":
            return await cmd_monitor_deployment(
                arguments.get("project_name", "website"),
                arguments.get("timeout_minutes", 10)
            )
            
        elif tool_name == "list_deployments":
            return await cmd_list_deployments(
                arguments.get("project_name", "website"),
                arguments.get("limit", 5)
            )
            
        elif tool_name == "get_deployment_logs":
            return await cmd_get_logs(arguments["deployment_id"])
            
        else:
            return f"❌ **Unknown tool**: {tool_name}"
            
    except Exception as e:
        logger.error(f"Error executing {tool_name}: {e}")
        return f"❌ **Error executing {tool_name}**: {str(e)}"

# CLI Interface
async def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return
    
    command = sys.argv[1]
    args = sys.argv[2:]
    
    # Map CLI commands to functions
    command_map = {
        "git-status": lambda: cmd_git_status(),
        "git-push": lambda: cmd_git_push(args[0] if args else "origin", args[1] if len(args) > 1 else None),
        "deploy-and-monitor": lambda: cmd_deploy_and_monitor(),
        "check-deployment": lambda: cmd_check_deployment(),
        "monitor-deployment": lambda: cmd_monitor_deployment(),
        "list-deployments": lambda: cmd_list_deployments(limit=int(args[0]) if args else 5),
        "get-logs": lambda: cmd_get_logs(args[0]) if args else cmd_get_logs("")
    }
    
    if command in command_map:
        try:
            result = await command_map[command]()
            print(result)
        except Exception as e:
            print(f"❌ **Error**: {str(e)}")
            return
    else:
        print(f"❌ **Unknown command**: {command}")
        print(__doc__)

if __name__ == "__main__":
    asyncio.run(main())