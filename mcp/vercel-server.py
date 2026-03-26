#!/usr/bin/env python3
"""
Git + Vercel MCP Server for deployment automation and monitoring.
Provides tools to push code and monitor Vercel deployments - no terminal required!

Usage with Claude Desktop:
- "Push my code and deploy to Vercel"
- "Check git status and push if ready"
- "Monitor my latest deployment"
- "Show me recent deployments"  
- "Get deployment logs for debugging"
"""

import asyncio
import json
import os
import sys
from typing import Any, Dict, List, Optional, Union
import subprocess
from datetime import datetime
import logging
import time

# Dependency checks
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

# Add the parent directory to the path so we can import MCP modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# MCP imports
from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent, CallResult
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
            params = {"limit": limit}
            if project_name:
                params["projectId"] = project_name
                
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

    async def get_project_info(self, project_name: str) -> Dict[str, Any]:
        """Get project information"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/v9/projects/{project_name}",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()

# Initialize Vercel client
vercel_client = None

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

async def check_current_deployment_status(project_name: str = "website") -> str:
    """Check the status of the most recent deployment"""
    try:
        deployments = await vercel_client.get_deployments(project_name=project_name, limit=1)
        
        if not deployments:
            return "No deployments found for this project."
        
        deployment = deployments[0]
        emoji = get_deployment_status_emoji(deployment.state)
        
        result = f"""
🚀 **Latest Deployment Status**

{emoji} **Status**: {deployment.state}
🔗 **URL**: {deployment.url}
📦 **Name**: {deployment.name}
🕐 **Created**: {format_timestamp(deployment.created)}
⚡ **Type**: {deployment.type}
📋 **ID**: {deployment.uid}
"""
        
        if deployment.ready:
            result += f"✅ **Ready At**: {format_timestamp(deployment.ready)}\n"
        
        if deployment.building_at:
            result += f"🔨 **Building At**: {format_timestamp(deployment.building_at)}\n"
            
        if deployment.target:
            result += f"🎯 **Target**: {deployment.target}\n"

        return result.strip()
        
    except Exception as e:
        logger.error(f"Error checking deployment status: {e}")
        return f"Error checking deployment status: {str(e)}"

async def get_deployment_logs_formatted(deployment_id: str) -> str:
    """Get formatted deployment logs"""
    try:
        logs = await vercel_client.get_deployment_logs(deployment_id)
        
        if not logs:
            return "No logs available for this deployment."
        
        formatted_logs = ["📋 **Deployment Logs**", ""]
        
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
            
            formatted_logs.append(f"{emoji} **{timestamp}** [{log_type}]: {message}")
        
        return "\n".join(formatted_logs)
        
    except Exception as e:
        logger.error(f"Error fetching deployment logs: {e}")
        return f"Error fetching logs: {str(e)}"

async def monitor_latest_deployment(project_name: str = "website", timeout_minutes: int = 10) -> str:
    """Monitor the latest deployment until completion or timeout"""
    try:
        deployments = await vercel_client.get_deployments(project_name=project_name, limit=1)
        
        if not deployments:
            return "No deployments found to monitor."
        
        deployment = deployments[0]
        deployment_id = deployment.uid
        
        start_time = datetime.now()
        timeout_seconds = timeout_minutes * 60
        
        result = [f"🔍 **Monitoring Deployment**: {deployment_id}", ""]
        
        while True:
            # Check if timeout exceeded
            elapsed = (datetime.now() - start_time).total_seconds()
            if elapsed > timeout_seconds:
                result.append(f"⏰ **Timeout**: Monitoring stopped after {timeout_minutes} minutes")
                break
            
            # Get current deployment status
            current_deployment = await vercel_client.get_deployment_by_id(deployment_id)
            
            if not current_deployment:
                result.append("❌ **Error**: Deployment not found")
                break
            
            emoji = get_deployment_status_emoji(current_deployment.state)
            timestamp = datetime.now().strftime("%H:%M:%S")
            result.append(f"{emoji} **{timestamp}**: {current_deployment.state}")
            
            # Check if deployment is complete
            if current_deployment.state in ["READY", "ERROR", "CANCELED"]:
                if current_deployment.state == "READY":
                    result.append(f"✅ **Deployment Complete!** Visit: {current_deployment.url}")
                else:
                    result.append(f"❌ **Deployment Failed**: {current_deployment.state}")
                break
            
            # Wait before next check
            await asyncio.sleep(5)
        
        return "\n".join(result)
        
    except Exception as e:
        logger.error(f"Error monitoring deployment: {e}")
        return f"Error monitoring deployment: {str(e)}"

# Initialize the MCP server
server = Server("vercel-deployment-monitor")

@server.list_tools()
async def list_tools() -> List[Tool]:
    """List available Vercel deployment tools"""
    return [
        Tool(
            name="check_deployment_status",
            description="Check the status of the most recent Vercel deployment",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_name": {
                        "type": "string",
                        "description": "Name of the Vercel project (default: website)",
                        "default": "website"
                    }
                }
            }
        ),
        Tool(
            name="get_deployment_logs", 
            description="Get build logs for a specific deployment",
            inputSchema={
                "type": "object",
                "properties": {
                    "deployment_id": {
                        "type": "string",
                        "description": "Vercel deployment ID"
                    }
                },
                "required": ["deployment_id"]
            }
        ),
        Tool(
            name="monitor_deployment",
            description="Monitor the latest deployment until completion",
            inputSchema={
                "type": "object", 
                "properties": {
                    "project_name": {
                        "type": "string",
                        "description": "Name of the Vercel project (default: website)",
                        "default": "website"
                    },
                    "timeout_minutes": {
                        "type": "integer",
                        "description": "Timeout in minutes (default: 10)",
                        "default": 10
                    }
                }
            }
        ),
        Tool(
            name="list_recent_deployments",
            description="List recent deployments for a project",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_name": {
                        "type": "string", 
                        "description": "Name of the Vercel project (default: website)",
                        "default": "website"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of deployments to return (default: 5)",
                        "default": 5
                    }
                }
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> CallResult:
    """Handle tool calls"""
    global vercel_client
    
    if not vercel_client:
        try:
            vercel_client = VercelClient()
        except ValueError as e:
            return CallResult(
                content=[TextContent(
                    type="text",
                    text=f"❌ **Configuration Error**: {str(e)}\n\nPlease set VERCEL_TOKEN environment variable."
                )]
            )
    
    try:
        if name == "check_deployment_status":
            project_name = arguments.get("project_name", "website")
            result = await check_current_deployment_status(project_name)
            
        elif name == "get_deployment_logs":
            deployment_id = arguments["deployment_id"]
            result = await get_deployment_logs_formatted(deployment_id)
            
        elif name == "monitor_deployment":
            project_name = arguments.get("project_name", "website")
            timeout_minutes = arguments.get("timeout_minutes", 10)
            result = await monitor_latest_deployment(project_name, timeout_minutes)
            
        elif name == "list_recent_deployments":
            project_name = arguments.get("project_name", "website")
            limit = arguments.get("limit", 5)
            
            deployments = await vercel_client.get_deployments(project_name=project_name, limit=limit)
            
            if not deployments:
                result = "No deployments found."
            else:
                lines = [f"📦 **Recent Deployments for {project_name}**", ""]
                for i, deployment in enumerate(deployments, 1):
                    emoji = get_deployment_status_emoji(deployment.state)
                    lines.append(f"{i}. {emoji} **{deployment.name}** ({deployment.state})")
                    lines.append(f"   🔗 {deployment.url}")
                    lines.append(f"   🕐 {format_timestamp(deployment.created)}")
                    lines.append(f"   📋 ID: {deployment.uid}")
                    lines.append("")
                result = "\n".join(lines)
        
        else:
            result = f"❌ Unknown tool: {name}"
        
        return CallResult(
            content=[TextContent(type="text", text=result)]
        )
        
    except Exception as e:
        logger.error(f"Error executing {name}: {e}")
        return CallResult(
            content=[TextContent(
                type="text", 
                text=f"❌ **Error executing {name}**: {str(e)}"
            )]
        )

async def main():
    """Run the MCP server"""
    logger.info("Starting Vercel Deployment Monitor MCP Server...")
    
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream, write_stream, 
            InitializationOptions(
                server_name="vercel-deployment-monitor",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=None,
                    experimental_capabilities=None
                )
            )
        )

if __name__ == "__main__":
    asyncio.run(main())