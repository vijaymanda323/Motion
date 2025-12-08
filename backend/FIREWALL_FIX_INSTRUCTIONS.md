# Fix Windows Firewall for Backend Server

## Quick Fix (Recommended)

### Option 1: Run PowerShell Script as Administrator

1. **Open PowerShell as Administrator:**
   - Press `Windows Key + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
   - Click "Yes" when prompted by UAC

2. **Navigate to backend folder and run:**
   ```powershell
   cd D:\motionphysio1\motionphysio\backend
   .\fix-firewall-public.ps1
   ```

### Option 2: Manual PowerShell Command (Run as Admin)

Open PowerShell as Administrator and run:

```powershell
New-NetFirewallRule -DisplayName "Backend Server Port 5000" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow -Profile Domain,Private,Public -Description "Allow backend server on port 5000"
```

### Option 3: Using Windows Firewall GUI

1. Press `Windows Key + R`, type `wf.msc` and press Enter
2. Click "Inbound Rules" in the left panel
3. Click "New Rule..." in the right panel
4. Select "Port" → Next
5. Select "TCP" and enter port `5000` → Next
6. Select "Allow the connection" → Next
7. Check all three profiles (Domain, Private, Public) → Next
8. Name it "Backend Server Port 5000" → Finish

## Verify Backend Server is Running

After fixing the firewall, make sure your backend server is running:

```powershell
cd D:\motionphysio1\motionphysio\backend
npm start
```

You should see:
```
Server is running on port 5000
Access from emulator: http://localhost:5000
```

## Test the Connection

After fixing firewall and starting the server, test if port 5000 is accessible:

```powershell
# Test from your computer
curl http://localhost:5000

# Or test from your phone's IP (replace with your computer's IP)
curl http://192.168.0.2:5000
```

## Troubleshooting

If still not working:

1. **Check if backend is listening on all interfaces:**
   - The server should be listening on `0.0.0.0:5000` (not just `localhost`)
   - Check `server.js` line 71: `app.listen(PORT, '0.0.0.0', ...)`

2. **Verify your IP address:**
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" under your active network adapter
   - Update `config/api.js` with the correct IP if needed

3. **Check Windows Firewall status:**
   ```powershell
   Get-NetFirewallRule -DisplayName "Backend Server Port 5000"
   ```

4. **Temporarily disable firewall to test (NOT recommended for production):**
   ```powershell
   Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
   ```
   Remember to re-enable it after testing!


