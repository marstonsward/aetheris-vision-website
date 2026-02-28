#!/usr/bin/env python3
"""
Vercel project management utilities for aetheris-vision-website.

Repo : https://github.com/marstonsward/aetheris-vision-website
File : scripts/vercel.py

Prerequisites:
  npm install -g vercel   # install CLI (one-time)
  vercel login            # authenticate (one-time)

Usage (run from the repo root):
  python3 scripts/vercel.py status    # check whether the site is live or paused
  python3 scripts/vercel.py pause     # take the site offline
  python3 scripts/vercel.py resume    # bring the site back online
"""

import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

PROJECT_ID = "prj_uay5qXhHLwIY4uSjY3aYJ8s6YXwz"
TEAM_ID    = "team_lY1NjTVX8QHcE6G2gQyX128F"

AUTH_PATH  = Path.home() / "Library/Application Support/com.vercel.cli/auth.json"

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_token() -> str:
    try:
        return json.loads(AUTH_PATH.read_text())["token"]
    except FileNotFoundError:
        sys.exit(f"Vercel auth file not found at {AUTH_PATH}.\nRun: vercel login")

def api(method: str, path: str, body: bytes | None = None) -> dict | None:
    token = get_token()
    url = f"https://api.vercel.com{path}?teamId={TEAM_ID}"
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read()
            return json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        sys.exit(f"API error {e.status}: {e.read().decode()}")

# ── Commands ──────────────────────────────────────────────────────────────────

def status():
    d = api("GET", f"/v9/projects/{PROJECT_ID}")
    paused = d.get("paused", False)
    state  = "PAUSED" if paused else "LIVE"
    prod   = d.get("targets", {}).get("production", {})
    ready  = prod.get("readyState", "n/a")
    print(f"Project : {d['name']}")
    print(f"State   : {state}")
    print(f"Build   : {ready}")

def pause():
    api("POST", f"/v1/projects/{PROJECT_ID}/pause", body=b"{}")
    print("Project paused. The site is now offline.")

def resume():
    # Note: if the project has never had a production deployment (i.e. was paused
    # before first deploy), the API returns 404. In that case, go to the Vercel
    # dashboard, open the project, and click the "Resume Service" button that
    # appears at the top of the page.
    api("POST", f"/v1/projects/{PROJECT_ID}/resume", body=b"{}")
    print("Project resumed. The site is live.")

# ── Entrypoint ────────────────────────────────────────────────────────────────

COMMANDS = {"status": status, "pause": pause, "resume": resume}

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in COMMANDS:
        print(__doc__)
        sys.exit(1)
    COMMANDS[sys.argv[1]]()
