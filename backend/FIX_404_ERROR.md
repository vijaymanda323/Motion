# Fix 404 Error on Production Server

## Problem
The endpoint `https://motion-physio-apk-1.onrender.com/api/videos/upload-file` returns 404.

## Root Cause
The production server on Render.com doesn't have the latest code with the video upload endpoint.

## Quick Fix Steps

### Step 1: Verify Local Code Works
Test locally first to ensure the endpoint works:

```bash
# Start local server
cd d:\motionphysio1\motionphysio\backend
npm start
```

Then test in Postman:
- **URL**: `http://localhost:5000/api/videos/upload-file`
- **Method**: POST
- **Body**: form-data with `video` file, `title`, and `userEmail`

If this works locally, proceed to Step 2.

### Step 2: Deploy to Render

#### Option A: If using Git (Recommended)
```bash
cd d:\motionphysio1
git add .
git commit -m "Add video upload endpoint"
git push origin main
```

Render will auto-deploy if connected to your Git repo.

#### Option B: Manual Deploy via Render Dashboard
1. Go to https://dashboard.render.com/
2. Find your service: `motion-physio-apk-1`
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait 2-5 minutes

### Step 3: Verify Deployment

After deployment, test these URLs:

1. **Health Check** (should return available endpoints):
   ```
   GET https://motion-physio-apk-1.onrender.com/api/health
   ```

2. **Test Endpoint**:
   ```
   GET https://motion-physio-apk-1.onrender.com/api/test
   ```

3. **Video Upload Endpoint**:
   ```
   POST https://motion-physio-apk-1.onrender.com/api/videos/upload-file
   ```

### Step 4: If Still Getting 404

1. **Check Render Logs**:
   - Go to Render Dashboard → Your Service → Logs
   - Look for errors during deployment or runtime

2. **Verify File Structure**:
   Ensure Render is looking in the right directory:
   - If backend is in `motionphysio/backend/`, set Root Directory in Render
   - Or ensure all files are in the root if that's what Render expects

3. **Check package.json location**:
   Render needs to find `package.json` in the root directory it's using

4. **Restart Service**:
   - In Render Dashboard → Your Service → Manual Deploy → Restart

---

## Expected Response After Fix

### Health Check Response:
```json
{
    "status": "ok",
    "availableEndpoints": {
        "video": {
            "uploadFile": "POST /api/videos/upload-file (multipart/form-data)"
        }
    }
}
```

### Video Upload Success Response:
```json
{
    "message": "Video uploaded successfully",
    "video": {
        "id": "...",
        "title": "...",
        "fileName": "..."
    }
}
```

---

## Important Notes

1. **Render Free Tier**: Services spin down after 15 min inactivity
   - First request may take 30-60 seconds (cold start)
   - This is normal for free tier

2. **Dependencies**: Make sure `multer` is in `package.json` (it already is ✅)

3. **Environment Variables**: If using `.env`, add them in Render Dashboard → Environment

4. **MongoDB Connection**: Ensure MongoDB Atlas allows connections from Render's IP (usually 0.0.0.0/0)

---

## Still Having Issues?

1. Check Render deployment logs for errors
2. Verify the route is registered in `routes/routes.js`
3. Ensure `server.js` includes `app.use('/api', routes)`
4. Test locally first to isolate the issue




