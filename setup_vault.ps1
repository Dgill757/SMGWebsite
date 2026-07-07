# SUMMIT VAULT SETUP SCRIPT
# Run this in PowerShell as Administrator
# Creates complete vault + skills structure

$vault = "C:\Users\DanGi\SummitVault"
Write-Host "Creating Summit Vault at $vault..." -ForegroundColor Cyan

# Create all folders
$folders = @(
    "OUTREACH\CAMPAIGNS", "OUTREACH\SCRAPER", "OUTREACH\REPLIES", "OUTREACH\SEQUENCES",
    "DEMOS\BUILT", "DEMOS\TEMPLATES", "DEMOS\AUDITS",
    "VOICE_AI\AGENTS", "VOICE_AI\SCRIPTS",
    "CONTENT\SOCIAL", "CONTENT\APPROVED", "CONTENT\ARCHIVE",
    "GHL\PIPELINE", "GHL\WORKFLOWS", "GHL\CONTACTS",
    "CLIENTS\ACTIVE", "CLIENTS\ONBOARDING",
    "ANALYTICS\DAILY", "ANALYTICS\WEEKLY", "ANALYTICS\FORECASTS",
    "WIKI\MARKET", "WIKI\COMPETITORS", "WIKI\TECH", "WIKI\PLAYBOOKS",
    "RAW",
    ".claude\skills\build-demo",
    ".claude\skills\morning-brief",
    ".claude\skills\weekly-content",
    ".claude\skills\apollo-scrape",
    ".claude\skills\reply-monitor",
    ".claude\skills\lead-enrich",
    ".claude\skills\marketing-audit",
    ".claude\skills\voice-agent",
    ".claude\skills\pipeline-snapshot",
    ".claude\skills\daily-brief",
    ".claude\skills\vault-cleanup"
)

foreach ($f in $folders) {
    New-Item -ItemType Directory -Force -Path "$vault\$f" | Out-Null
    Write-Host "  Created: $f" -ForegroundColor DarkGreen
}

Write-Host ""
Write-Host "Vault structure created!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Copy CLAUDE.md to: $vault\CLAUDE.md"
Write-Host "2. Copy all SKILL.md files to: $vault\.claude\skills\[skill-name]\SKILL.md"
Write-Host "3. Open Obsidian -> Open vault -> select $vault"
Write-Host "4. Install Terminal plugin (Community Plugins -> Browse -> Terminal)"
Write-Host "5. Open terminal in Obsidian -> type: claude"
Write-Host ""
Write-Host "Done! SummitVault ready." -ForegroundColor Green
