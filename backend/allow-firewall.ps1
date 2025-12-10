# Script to allow Node.js through Windows Firewall for port 5000
Write-Host "Configuring Windows Firewall for backend server..." -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script needs administrator privileges." -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Write-Host "`nOr manually:" -ForegroundColor Yellow
    Write-Host "1. Open Windows Defender Firewall" -ForegroundColor Yellow
    Write-Host "2. Click 'Allow an app through firewall'" -ForegroundColor Yellow
    Write-Host "3. Find 'Node.js' and check 'Private' network" -ForegroundColor Yellow
    exit 1
}

# Allow Node.js through firewall
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($nodePath) {
    Write-Host "Found Node.js at: $nodePath" -ForegroundColor Green
    
    # Add firewall rule for Node.js
    $ruleName = "Node.js Backend Server"
    $existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    
    if ($existingRule) {
        Write-Host "Firewall rule already exists. Removing old rule..." -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    }
    
    try {
        New-NetFirewallRule -DisplayName $ruleName `
            -Direction Inbound `
            -Program $nodePath `
            -Action Allow `
            -Profile Private `
            -Description "Allow Node.js backend server on port 5000" | Out-Null
        
        Write-Host "✅ Firewall rule created successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error creating firewall rule: $_" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Node.js not found in PATH" -ForegroundColor Red
}

# Also add a port rule for port 5000
try {
    $portRuleName = "Backend Server Port 5000"
    $existingPortRule = Get-NetFirewallRule -DisplayName $portRuleName -ErrorAction SilentlyContinue
    
    if ($existingPortRule) {
        Write-Host "Port rule already exists. Removing old rule..." -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName $portRuleName -ErrorAction SilentlyContinue
    }
    
    New-NetFirewallRule -DisplayName $portRuleName `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 5000 `
        -Action Allow `
        -Profile Private `
        -Description "Allow incoming connections on port 5000 for backend server" | Out-Null
    
    Write-Host "✅ Port 5000 firewall rule created!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not create port rule: $_" -ForegroundColor Yellow
}

Write-Host "`n✅ Firewall configuration complete!" -ForegroundColor Green
Write-Host "You may need to restart the backend server for changes to take effect." -ForegroundColor Yellow








