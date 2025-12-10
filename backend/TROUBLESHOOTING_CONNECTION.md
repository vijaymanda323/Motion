# Troubleshooting Backend Connection Issues

## Problem: Connection Timeout to Backend Server

If you're getting "Request timeout" or "Cannot connect to server" errors, follow these steps:

## Step 1: Verify Backend Server is Running

1. Open a terminal/command prompt
2. Navigate to backend folder:
   ```bash
   cd d:\motionphysio1\motionphysio\backend
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. You should see:
   ```
   Server is running on port 5000
   ✅ Connected to MongoDB successfully
   ```

## Step 2: Check Your Current IP Address

1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
2. Run:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`
3. Look for your **IPv4 Address** (usually starts with 192.168.x.x or 10.x.x.x)
4. Update `config/api.js` with the correct IP:
   ```javascript
   const YOUR_COMPUTER_IP = 'YOUR_ACTUAL_IP_HERE'; // e.g., '192.168.1.100'
   ```

## Step 3: Test Backend Connection

### Option A: Test in Browser
Open in your browser:
- `http://localhost:5000` - Should show "Backend server is running"
- `http://localhost:5000/api/health` - Should show API health status

### Option B: Test with curl
```bash
curl http://localhost:5000/api/health
```

### Option C: Test from Your Phone/Device
- Make sure your phone and computer are on the **same WiFi network**
- Open: `http://YOUR_IP:5000/api/health` (replace YOUR_IP with your actual IP)

## Step 4: Check Firewall Settings

Windows Firewall might be blocking the connection:

1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Firewall"
3. Find Node.js and make sure it's allowed for Private networks
4. Or temporarily disable firewall to test (NOT recommended for production)

## Step 5: Verify Port 5000 is Available

Check if port 5000 is in use:
```bash
netstat -an | findstr :5000
```

If something else is using port 5000, either:
- Stop that application
- Change the port in `backend/server.js`:
  ```javascript
  const PORT = process.env.PORT || 5000; // Change 5000 to another port
  ```

## Step 6: For Android Emulator

If using Android Emulator, you need to use `localhost` instead of IP:

1. Update `config/api.js`:
   ```javascript
   API_BASE_URL = `http://localhost:5000/api`;
   ```

2. Set up port forwarding:
   ```bash
   adb reverse tcp:5000 tcp:5000
   ```

## Step 7: For iOS Simulator

If using iOS Simulator, use `localhost`:
```javascript
API_BASE_URL = `http://localhost:5000/api`;
```

## Step 8: For Physical Device (Expo QR Code)

1. Make sure your phone and computer are on the **same WiFi network**
2. Use your computer's IP address (from Step 2)
3. Update `config/api.js` with the correct IP
4. Make sure backend server is running
5. Test connection from phone browser first

## Quick Test Commands

```bash
# Check if server is running
netstat -an | findstr :5000

# Get your IP address
ipconfig | findstr IPv4

# Test backend locally
curl http://localhost:5000

# Test backend from network
curl http://YOUR_IP:5000
```

## Common Issues

### Issue: "Request timeout"
- **Solution**: Backend server is not running or not accessible
- **Fix**: Start backend server and verify it's listening on 0.0.0.0:5000

### Issue: "Network request failed"
- **Solution**: Wrong IP address or firewall blocking
- **Fix**: Update IP address and check firewall settings

### Issue: "Cannot connect to server"
- **Solution**: Server not running or wrong URL
- **Fix**: Verify server is running and check API_BASE_URL in config

## Still Having Issues?

1. Check backend server logs for errors
2. Verify MongoDB connection (server should show "✅ Connected to MongoDB")
3. Try accessing `http://localhost:5000` in browser
4. Check if antivirus is blocking Node.js
5. Try restarting the backend server


