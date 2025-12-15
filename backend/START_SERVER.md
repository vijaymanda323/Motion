# How to Start Backend Server

## Quick Start

1. Open a terminal/command prompt
2. Navigate to backend folder:
   ```bash
   cd d:\motionphysio1\motionphysio\backend
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Expected Output

You should see:
```
✅ Connected to MongoDB successfully
Server is running on port 5000
Access from emulator: http://localhost:5000
Access from physical device: http://YOUR_COMPUTER_IP:5000
API endpoint: http://YOUR_COMPUTER_IP:5000/api
```

## Verify Server is Running

1. Open browser and go to: `http://localhost:5000`
2. You should see: `{"message":"Backend server is running"}`

## Troubleshooting

### Port 5000 Already in Use
If you get "port 5000 already in use":
- Find what's using it: `netstat -ano | findstr :5000`
- Kill the process or change port in `server.js`

### MongoDB Connection Error
- Check MongoDB Atlas network access settings
- Ensure your IP is whitelisted
- Server will still run but database operations will fail

### Can't Connect from Phone
- Make sure phone and computer are on same WiFi
- Check Windows Firewall settings
- Verify IP address in `config/api.js` matches your computer's IP


