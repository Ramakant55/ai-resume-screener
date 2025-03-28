const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { authVerifyToken } = require('../middleware/auth.middleware');
const router = express.Router();

// Get user profile
router.get('/profile', authVerifyToken, getUserProfile);

// Update user profile
router.put('/update-profile', authVerifyToken, updateUserProfile);

module.exports = router;
