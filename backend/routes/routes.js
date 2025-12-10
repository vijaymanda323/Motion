const express = require('express');
const router = express.Router();
const { 
    createUser, 
    loginUser, 
    updateProfile, 
    getUserProfile,
    uploadVideo,
    uploadVideoFile,
    upload,
    getAllVideos,
    getVideosByRoutine,
    getUserVideos,
    getVideoById,
    streamVideo,
    getVideoThumbnail,
    updateVideo,
    deleteVideo
} = require('../Controller/Controller');

// User routes
router.post('/users/register', createUser);
router.post('/users/login', loginUser);
router.put('/users/profile', updateProfile);
router.get('/users/profile/:email', getUserProfile);

// Video routes
// Upload video using multipart/form-data (for Postman file uploads and React Native)
// Using single() for better React Native compatibility
router.post('/videos/upload-file', upload.single('video'), uploadVideoFile);
// Upload video using base64 (original endpoint)
router.post('/videos/upload', uploadVideo);
// Get all public videos (shared across all users)
router.get('/videos', getAllVideos);
// Get videos by routine name (for Quick Relief)
router.get('/videos/routine/:routineName', getVideosByRoutine);
router.get('/videos/user/:email', getUserVideos);
router.get('/videos/:videoId', getVideoById); // Get video metadata (use ?includeData=true for video data)
router.get('/videos/:videoId/stream', streamVideo); // Stream video file for playback
router.get('/videos/:videoId/thumbnail', getVideoThumbnail); // Get thumbnail image
router.put('/videos/:videoId', updateVideo);
router.delete('/videos/:videoId', deleteVideo);

module.exports = router;

