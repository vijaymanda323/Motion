# Script to change network profile from Public to Private
# MUST be run as Administrator

Write-Host "Changing Network Profile to Private..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor Yellow
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Write-Host "`nOr use the manual method below." -ForegroundColor Yellow
    exit 1
}

# Get all network profiles
$profiles = Get-NetConnectionProfile

foreach ($profile in $profiles) {
    Write-Host "`nNetwork: $($profile.Name)" -ForegroundColor White
    Write-Host "  Current Profile: $($profile.NetworkCategory)" -ForegroundColor $(if ($profile.NetworkCategory -eq "Public") { "Yellow" } else { "Green" })
    
    if ($profile.NetworkCategory -eq "Public") {
        try {
            Set-NetConnectionProfile -InterfaceIndex $profile.InterfaceIndex -NetworkCategory Private
            Write-Host "  ✅ Changed to Private!" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ Error: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  ✓ Already set to $($profile.NetworkCategory)" -ForegroundColor Green
    }
}

Write-Host "`n✅ Network profile update complete!" -ForegroundColor Green
Write-Host "`nYou may need to:" -ForegroundColor Yellow
Write-Host "1. Restart the backend server" -ForegroundColor Yellow
Write-Host "2. Reload your React Native app" -ForegroundColor Yellow












