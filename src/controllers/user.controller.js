const User = require('../models/user.model');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching profile for user ID:', userId);
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Add isAdmin property based on role
        const userResponse = user.toObject();
        userResponse.isAdmin = user.role === 'admin';
        
        console.log('User profile found:', userResponse);
        res.status(200).json(userResponse);
    } catch (err) {
        console.error('Error in getUserProfile:', err);
        res.status(500).json({ message: 'Server error while fetching user profile' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;
        
        // Validate input
        if (!name && !email) {
            return res.status(400).json({ message: 'Please provide fields to update' });
        }
        
        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        
        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Add isAdmin property based on role
        const userResponse = updatedUser.toObject();
        userResponse.isAdmin = updatedUser.role === 'admin';
        
        res.status(200).json(userResponse);
    } catch (err) {
        console.error('Error in updateUserProfile:', err);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};
