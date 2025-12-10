# Video Upload API Documentation

## Overview
This API allows you to upload videos to MongoDB using GridFS. The video schema is already set up in the backend.

## Endpoint for Postman File Upload

### Upload Video (Multipart/Form-Data)
**POST** `/api/videos/upload-file`

This endpoint accepts video files using `multipart/form-data`, which is perfect for Postman file uploads.

#### Request Details:
- **Method**: POST
- **Production URL**: `https://motion-physio-apk-1.onrender.com/api/videos/upload-file`
- **Local Development URL**: `http://localhost:5000/api/videos/upload-file`
- **Content-Type**: `multipart/form-data` (set automatically by Postman)

#### Required Fields (Form-Data):
1. **video** (File) - The video file to upload
   - Accepted formats: Any video format (mp4, mov, avi, etc.)
   - Max size: 500MB

2. **title** (Text) - Title of the video
   - Required: Yes

3. **userEmail** (Text) - Email of the user uploading the video
   - Required: Yes
   - Must be a registered user in the database

#### Optional Fields (Form-Data):
- **description** (Text) - Description of the video
- **category** (Text) - Category: `exercise`, `tutorial`, `workout`, or `other` (default: `other`)
- **tags** (Text) - Comma-separated tags (e.g., "fitness, workout, cardio")
- **isPublic** (Text) - Set to `"true"` or `"false"` (default: `false`)
- **duration** (Text) - Duration in seconds (e.g., "120" for 2 minutes)
- **thumbnail** (File) - Thumbnail image file (optional)
  - Accepted formats: jpg, png, gif, etc.

#### Example Request in Postman:

1. **Method**: Select `POST`
2. **URL**: 
   - **Production**: `https://motion-physio-apk-1.onrender.com/api/videos/upload-file`
   - **Local**: `http://localhost:5000/api/videos/upload-file`
3. **Body Tab**: 
   - Select `form-data`
   - Add the following fields:
     - `video` (Type: File) - Click "Select Files" and choose your video
     - `title` (Type: Text) - e.g., "My Workout Video"
     - `userEmail` (Type: Text) - e.g., "user@example.com"
     - `description` (Type: Text) - e.g., "Morning workout routine"
     - `category` (Type: Text) - e.g., "workout"
     - `tags` (Type: Text) - e.g., "fitness, morning, cardio"
     - `isPublic` (Type: Text) - e.g., "true"
     - `thumbnail` (Type: File) - Optional: Select an image file

4. **Headers**: Postman will automatically set `Content-Type: multipart/form-data`

#### Success Response (201 Created):
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

#### Error Responses:

**400 Bad Request** - Missing required fields:
```json
{
    "message": "Title and userEmail are required"
}
```

**400 Bad Request** - No video file:
```json
{
    "message": "Video file is required. Please upload a video file using multipart/form-data."
}
```

**404 Not Found** - User not found:
```json
{
    "message": "User not found"
}
```

**500 Internal Server Error**:
```json
{
    "message": "Error uploading video",
    "error": "Error details here"
}
```

---

## Alternative Endpoint (Base64 Upload)

### Upload Video (Base64)
**POST** `/api/videos/upload`

This endpoint accepts base64-encoded video data in JSON format.

#### Request Details:
- **Method**: POST
- **Production URL**: `https://motion-physio-apk-1.onrender.com/api/videos/upload`
- **Local Development URL**: `http://localhost:5000/api/videos/upload`
- **Content-Type**: `application/json`

#### Request Body (JSON):
```json
{
    "title": "My Workout Video",
    "fileName": "workout.mp4",
    "videoData": "base64_encoded_video_string_here",
    "userEmail": "user@example.com",
    "contentType": "video/mp4",
    "fileSize": 15728640,
    "description": "Morning workout routine",
    "category": "workout",
    "tags": ["fitness", "morning"],
    "isPublic": false,
    "duration": 120,
    "thumbnailData": "base64_encoded_thumbnail_string_here",
    "thumbnailContentType": "image/jpeg"
}
```

---

## Other Video Endpoints

### Get User Videos
**GET** `/api/videos/user/:email`

Get all videos uploaded by a specific user.

**Production Example**: `GET https://motion-physio-apk-1.onrender.com/api/videos/user/user@example.com`
**Local Example**: `GET http://localhost:5000/api/videos/user/user@example.com`

### Get Video by ID
**GET** `/api/videos/:videoId`

Get video metadata by ID.

**Production Example**: `GET https://motion-physio-apk-1.onrender.com/api/videos/507f1f77bcf86cd799439011`
**Local Example**: `GET http://localhost:5000/api/videos/507f1f77bcf86cd799439011`

### Stream Video
**GET** `/api/videos/:videoId/stream`

Stream the actual video file for playback.

**Production Example**: `GET https://motion-physio-apk-1.onrender.com/api/videos/507f1f77bcf86cd799439011/stream`
**Local Example**: `GET http://localhost:5000/api/videos/507f1f77bcf86cd799439011/stream`

### Get Video Thumbnail
**GET** `/api/videos/:videoId/thumbnail`

Get the thumbnail image for a video.

**Production Example**: `GET https://motion-physio-apk-1.onrender.com/api/videos/507f1f77bcf86cd799439011/thumbnail`
**Local Example**: `GET http://localhost:5000/api/videos/507f1f77bcf86cd799439011/thumbnail`

### Update Video
**PUT** `/api/videos/:videoId`

Update video metadata.

**Production Example**: `PUT https://motion-physio-apk-1.onrender.com/api/videos/507f1f77bcf86cd799439011`
**Local Example**: `PUT http://localhost:5000/api/videos/507f1f77bcf86cd799439011`

### Delete Video
**DELETE** `/api/videos/:videoId`

Delete a video and its associated files from GridFS.

**Production Example**: `DELETE https://motion-physio-apk-1.onrender.com/api/videos/507f1f77bcf86cd799439011`
**Local Example**: `DELETE http://localhost:5000/api/videos/507f1f77bcf86cd799439011`

---

## Video Schema

The video schema includes:
- `title` (required) - Video title
- `description` - Video description
- `fileName` - Original filename
- `gridFSVideoId` - GridFS file ID for the video
- `contentType` - MIME type (e.g., "video/mp4")
- `fileSize` - Size in bytes
- `duration` - Duration in seconds
- `gridFSThumbnailId` - GridFS file ID for thumbnail (optional)
- `user` - Reference to User model
- `userEmail` - User's email (indexed)
- `category` - exercise, tutorial, workout, or other
- `tags` - Array of tags
- `isPublic` - Boolean
- `views` - View count
- `likes` - Like count
- `status` - uploading, processing, ready, or failed
- `uploadedAt` - Upload timestamp
- `updatedAt` - Last update timestamp

---

## Notes

1. **User must exist**: The `userEmail` must belong to a registered user in the database.
2. **File size limit**: Maximum 500MB per video file.
3. **GridFS storage**: Videos are stored in MongoDB GridFS, not as base64 in documents.
4. **Thumbnail**: Optional, but recommended for better user experience.
5. **Production URL**: Use `https://motion-physio-apk-1.onrender.com/api/videos/upload-file` for production/testing deployed backend.
6. **Local Development**: Use `http://localhost:5000/api/videos/upload-file` when testing locally.

---

## Testing in Postman

### Quick Test Steps (Production):

1. Ensure you have a registered user in the database
2. Open Postman
3. Create a new POST request to `https://motion-physio-apk-1.onrender.com/api/videos/upload-file`
4. In the Body tab, select `form-data`
5. Add `video` field (Type: File) and select a video file
6. Add `title` field (Type: Text) with a title
7. Add `userEmail` field (Type: Text) with a registered user's email
8. Click Send
9. You should receive a success response with the video ID

### Quick Test Steps (Local Development):

1. Make sure your backend server is running on port 5000
2. Ensure you have a registered user in the database
3. Open Postman
4. Create a new POST request to `http://localhost:5000/api/videos/upload-file`
5. In the Body tab, select `form-data`
6. Add `video` field (Type: File) and select a video file
7. Add `title` field (Type: Text) with a title
8. Add `userEmail` field (Type: Text) with a registered user's email
9. Click Send
10. You should receive a success response with the video ID

