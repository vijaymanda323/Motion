const express = require('express');
const router = express.Router();
const { createUser, loginUser, updateProfile, getUserProfile } = require('../Controller/Controller');

// User routes
router.post('/users/register', createUser);
router.post('/users/login', loginUser);
router.put('/users/profile', updateProfile);
router.get('/users/profile/:email', getUserProfile);

module.exports = router;

