# Postman Setup for Production Video Upload

## Production URL
**Base URL**: `https://motion-physio-apk-1.onrender.com/api`

## Video Upload Endpoint

### POST Request to Upload Video

**URL**: `https://motion-physio-apk-1.onrender.com/api/videos/upload-file`

### Step-by-Step Postman Setup:

1. **Open Postman** and create a new request

2. **Set Method**: Select `POST` from the dropdown

3. **Enter URL**: 
   ```
   https://motion-physio-apk-1.onrender.com/api/videos/upload-file
   ```

4. **Go to Body Tab**:
   - Select `form-data` (NOT `raw` or `x-www-form-urlencoded`)

5. **Add Required Fields**:
   
   | Key | Type | Value | Required |
   |-----|------|-------|----------|
   | `video` | **File** | Select your video file | ✅ Yes |
   | `title` | **Text** | e.g., "My Workout Video" | ✅ Yes |
   | `userEmail` | **Text** | e.g., "user@example.com" | ✅ Yes |
   | `description` | **Text** | Video description | ❌ No |
   | `category` | **Text** | "exercise", "tutorial", "workout", or "other" | ❌ No |
   | `tags` | **Text** | Comma-separated: "fitness, workout" | ❌ No |
   | `isPublic` | **Text** | "true" or "false" | ❌ No |
   | `duration` | **Text** | Duration in seconds: "120" | ❌ No |
   | `thumbnail` | **File** | Thumbnail image file | ❌ No |

6. **Important**: 
   - Make sure `video` field type is set to **File** (not Text)
   - Click "Select Files" next to the `video` field to choose your video
   - For thumbnail, also set type to **File**

7. **Click Send**

### Expected Success Response (201):
```json
{
    "message": "Video uploaded successfully",
    "video": {
        "id": "507f1f77bcf86cd799439011",
        "title": "My Workout Video",
        "fileName": "workout.mp4",
        "contentType": "video/mp4",
        "fileSize": 15728640,
        "duration": 120,
        "category": "workout",
        "tags": ["fitness", "morning", "cardio"],
        "uploadedAt": "2025-01-15T10:30:00.000Z"
    }
}
```

### Common Errors:

**400 Bad Request - Missing fields**:
```json
{
    "message": "Title and userEmail are required"
}
```
**Solution**: Make sure `title` and `userEmail` are filled in.

**400 Bad Request - No video file**:
```json
{
    "message": "Video file is required. Please upload a video file using multipart/form-data."
}
```
**Solution**: Make sure the `video` field type is set to **File** and you've selected a file.

**404 Not Found - User not found**:
```json
{
    "message": "User not found"
}
```
**Solution**: The `userEmail` must belong to a registered user. Register the user first using `/api/users/register`.

**503 Service Unavailable**:
```json
{
    "message": "Database connection not available.",
    "error": "MongoDB not connected"
}
```
**Solution**: The backend database connection might be down. Check if the production server is running.

---

## Other Production Endpoints

### Get User Videos
**GET** `https://motion-physio-apk-1.onrender.com/api/videos/user/:email`

Example: `https://motion-physio-apk-1.onrender.com/api/videos/user/user@example.com`

### Get Video by ID
**GET** `https://motion-physio-apk-1.onrender.com/api/videos/:videoId`

Example: `https://motion-physio-apk-1.onrender.com/api/videos/507f1f77bcf86cd799439011`

### Stream Video
**GET** `https://motion-physio-apk-1.onrender.com/api/videos/:videoId/stream`

Example: `https://motion-physio-apk-1.onrender.com/api/videos/507f1f77bcf86cd799439011/stream`

### Get Video Thumbnail
**GET** `https://motion-physio-apk-1.onrender.com/api/videos/:videoId/thumbnail`

Example: `https://motion-physio-apk-1.onrender.com/api/videos/507f1f77bcf86cd799439011/thumbnail`

### Update Video
**PUT** `https://motion-physio-apk-1.onrender.com/api/videos/:videoId`

### Delete Video
**DELETE** `https://motion-physio-apk-1.onrender.com/api/videos/:videoId`

---

## Tips

1. **File Size**: Maximum 500MB per video file
2. **Video Formats**: Any video format is accepted (mp4, mov, avi, etc.)
3. **Thumbnail**: Optional but recommended - use jpg, png, or gif
4. **User Email**: Must be lowercase and match exactly with registered user
5. **Tags**: Separate multiple tags with commas: "fitness, workout, cardio"
6. **Category**: Must be one of: "exercise", "tutorial", "workout", or "other"

---

## Quick Test

1. **Register a user first** (if not already registered):
   - POST `https://motion-physio-apk-1.onrender.com/api/users/register`
   - Body (JSON):
     ```json
     {
         "name": "Test User",
         "email": "test@example.com",
         "password": "password123"
     }
     ```

2. **Upload a video**:
   - POST `https://motion-physio-apk-1.onrender.com/api/videos/upload-file`
   - Use form-data with `video`, `title`, and `userEmail` fields

3. **Get user videos**:
   - GET `https://motion-physio-apk-1.onrender.com/api/videos/user/test@example.com`

