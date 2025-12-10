# Script to set up ADB port forwarding for Android emulator
# This allows the emulator to access localhost:5000 on your computer

Write-Host "=== ADB PORT FORWARDING SETUP ===" -ForegroundColor Cyan
Write-Host ""

# Common ADB locations
$adbPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe",
    "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools\adb.exe",
    "C:\Program Files\Android\android-sdk\platform-tools\adb.exe",
    "adb"  # Try if it's in PATH
)

$adb = $null
foreach ($path in $adbPaths) {
    if ($path -eq "adb") {
        $adb = Get-Command adb -ErrorAction SilentlyContinue
        if ($adb) {
            $adb = $adb.Source
            break
        }
    } else {
        if (Test-Path $path) {
            $adb = $path
            break
        }
    }
}

if (-not $adb) {
    Write-Host "❌ ADB not found!" -ForegroundColor Red
    Write-Host "`nPlease install Android Studio or Android SDK Platform Tools." -ForegroundColor Yellow
    Write-Host "ADB is usually located at:" -ForegroundColor Yellow
    Write-Host "  %LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Found ADB at: $adb" -ForegroundColor Green
Write-Host ""

# Check if emulator is connected
Write-Host "Checking for connected Android devices/emulators..." -ForegroundColor Yellow
$devices = & $adb devices 2>&1
Write-Host $devices

$deviceCount = ($devices | Select-String "device$" | Measure-Object).Count

if ($deviceCount -eq 0) {
    Write-Host "`n⚠️  No Android devices/emulators found!" -ForegroundColor Yellow
    Write-Host "Please make sure:" -ForegroundColor Yellow
    Write-Host "1. Android emulator is running" -ForegroundColor White
    Write-Host "2. Emulator is fully booted (not just starting)" -ForegroundColor White
    exit 1
}

Write-Host "`n✅ Found $deviceCount device(s)" -ForegroundColor Green

# Set up port forwarding
Write-Host "`nSetting up port forwarding (localhost:5000 -> localhost:5000)..." -ForegroundColor Yellow
$result = & $adb reverse tcp:5000 tcp:5000 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Port forwarding set up successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Error setting up port forwarding: $result" -ForegroundColor Red
    exit 1
}

# Verify port forwarding
Write-Host "`nVerifying port forwarding..." -ForegroundColor Yellow
$reverseList = & $adb reverse --list 2>&1
Write-Host $reverseList

if ($reverseList -like "*5000*") {
    Write-Host "`n✅✅✅ Port forwarding is active!" -ForegroundColor Green
    Write-Host "`nYour Android emulator can now access:" -ForegroundColor Cyan
    Write-Host "  http://localhost:5000/api" -ForegroundColor White
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Make sure backend server is running (cd backend && npm start)" -ForegroundColor White
    Write-Host "2. Reload your React Native app" -ForegroundColor White
    Write-Host "3. Try logging in" -ForegroundColor White
    Write-Host "`nNote: You need to run this script again if you restart the emulator" -ForegroundColor Yellow
} else {
    Write-Host "`n⚠️  Port forwarding may not be active" -ForegroundColor Yellow
}






