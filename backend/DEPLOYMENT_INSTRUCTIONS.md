# Deployment Instructions for Render.com

## Issue: 404 Errors on Production Server

If you're getting 404 errors on `https://motion-physio-apk-1.onrender.com`, it means the production server doesn't have the latest code with the video upload endpoint.

## Solution: Deploy Latest Code to Render

### Option 1: Auto-Deploy from Git (Recommended)

If your Render service is connected to a Git repository:

1. **Commit and push your latest code**:
   ```bash
   cd d:\motionphysio1\motionphysio\backend
   git add .
   git commit -m "Add video upload endpoint with multer"
   git push origin main
   ```

2. **Render will automatically deploy** the new code (if auto-deploy is enabled)

3. **Wait 2-5 minutes** for deployment to complete

4. **Check deployment logs** in Render dashboard to ensure deployment succeeded

### Option 2: Manual Deploy via Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your service: `motion-physio-apk-1`
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment to complete

### Option 3: Rebuild Service

1. Go to Render Dashboard
2. Select your service
3. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
4. This ensures all dependencies (including `multer`) are installed

---

## Verify Deployment

After deployment, test these endpoints:

### 1. Health Check
```bash
GET https://motion-physio-apk-1.onrender.com/api/health
```

Expected response:
```json
{
    "status": "ok",
    "message": "Backend server is running",
    "availableEndpoints": {
        "video": {
            "uploadFile": "POST /api/videos/upload-file (multipart/form-data)"
        }
    }
}
```

### 2. Test Endpoint
```bash
GET https://motion-physio-apk-1.onrender.com/api/test
```

### 3. Video Upload Endpoint
```bash
POST https://motion-physio-apk-1.onrender.com/api/videos/upload-file
```

---

## Render Service Configuration

Make sure your Render service has these settings:

### Build Command:
```bash
cd backend && npm install
```

### Start Command:
```bash
cd backend && npm start
```

### Environment Variables:
- `PORT` - Usually set automatically by Render
- `MONGODB_URI` - Your MongoDB connection string (if using .env)
- `JWT_SECRET` - Your JWT secret key (if using .env)

### Root Directory:
If your backend is in a subfolder, set:
```
Root Directory: motionphysio/backend
```

---

## Required Dependencies

Make sure `package.json` includes:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^2.0.2"
  }
}
```

---

## Troubleshooting

### If endpoints still return 404 after deployment:

1. **Check deployment logs** in Render dashboard for errors
2. **Verify the route is registered** - Check that `server.js` includes:
   ```javascript
   app.use('/api', routes);
   ```
3. **Check file structure** - Ensure all files are in the correct location:
   ```
   backend/
   ├── server.js
   ├── routes/
   │   └── routes.js
   ├── Controller/
   │   └── Controller.js
   ├── models/
   │   └── Schema.js
   └── package.json
   ```
4. **Restart the service** in Render dashboard
5. **Check server logs** for any runtime errors

### If multer is not found:

1. Ensure `multer` is in `package.json` dependencies
2. Run `npm install` locally to update `package-lock.json`
3. Commit and push `package-lock.json`
4. Redeploy on Render

---

## Quick Test After Deployment

Use Postman or curl to test:

```bash
# Health check
curl https://motion-physio-apk-1.onrender.com/api/health

# Test endpoint
curl https://motion-physio-apk-1.onrender.com/api/test

# Video upload (replace with actual file)
curl -X POST https://motion-physio-apk-1.onrender.com/api/videos/upload-file \
  -F "video=@/path/to/video.mp4" \
  -F "title=Test Video" \
  -F "userEmail=test@example.com"
```

---

## Notes

- Render free tier services **spin down after 15 minutes** of inactivity
- First request after spin-down may take 30-60 seconds (cold start)
- Consider upgrading to paid tier for always-on service
- Check Render dashboard for service status and logs

