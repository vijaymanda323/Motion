# Script to allow port 5000 through firewall for PUBLIC networks
# MUST be run as Administrator

Write-Host "=== FIXING FIREWALL FOR PUBLIC NETWORK ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor Yellow
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    exit 1
}

$ruleName = "Backend Server Port 5000 - All Networks"

# Remove existing rule if it exists
$existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existingRule) {
    Write-Host "Removing existing rule..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
}

# Create new rule for ALL network profiles (Public, Private, Domain)
try {
    New-NetFirewallRule -DisplayName $ruleName `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 5000 `
        -Action Allow `
        -Profile Domain,Private,Public `
        -Description "Allow backend server on port 5000 for all network types" | Out-Null
    
    Write-Host "✅ Firewall rule created successfully!" -ForegroundColor Green
    Write-Host "   Rule applies to: Public, Private, and Domain networks" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creating firewall rule: $_" -ForegroundColor Red
    exit 1
}

# Verify the rule was created
$rule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($rule) {
    Write-Host "`n✅ Verification:" -ForegroundColor Green
    Write-Host "   Rule Name: $($rule.DisplayName)" -ForegroundColor White
    Write-Host "   Enabled: $($rule.Enabled)" -ForegroundColor White
    Write-Host "   Profiles: $($rule.Profile -join ', ')" -ForegroundColor White
    Write-Host "   Action: $($rule.Action)" -ForegroundColor White
} else {
    Write-Host "⚠️  Rule created but could not verify" -ForegroundColor Yellow
}

Write-Host "`n✅ Firewall configuration complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Make sure backend server is running (cd backend && npm start)" -ForegroundColor White
Write-Host "2. Reload your React Native app" -ForegroundColor White
Write-Host "3. Try logging in again" -ForegroundColor White









