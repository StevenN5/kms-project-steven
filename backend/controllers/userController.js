const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');
// const generateToken = require('../utils/generateToken.js'); 

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user didapat dari middleware 'protect'
    const user = req.user;

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { username, email, name } = req.body;

        // Cek duplikat username
        if (username && username !== user.username) {
            const userExists = await User.findOne({ username });
            if (userExists) {
                res.status(400);
                throw new Error('Username already taken');
            }
            user.username = username;
        }

        // Cek duplikat email
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                res.status(400);
                throw new Error('Email already in use');
            }
            user.email = email;
        }

        user.name = name || user.name;

        const updatedUser = await user.save();

        res.json({
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
            },
            message: "Profile updated successfully"
        });

    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user password
// @route   PUT /api/users/change-password
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide current and new password');
    }

    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
        // Password akan di-hash oleh hook pre-save di model
        user.password = newPassword;
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid current password');
    }
});


// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});


// --- FUNGSI BARU DARI MERGE ---

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Mencegah admin menghapus dirinya sendiri
    if (req.user._id.equals(user._id)) {
        res.status(400);
        throw new Error('Cannot delete your own admin account');
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
});

// @desc    Toggle user active status (Admin only)
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Mencegah admin menonaktifkan dirinya sendiri
    if (req.user._id.equals(user._id)) {
        res.status(400);
        throw new Error('Cannot deactivate your own account');
    }

    // Model 'userModel.js' Anda harus punya field 'isActive'
    user.isActive = !user.isActive; 
    await user.save();
    
    res.json({ 
        message: `User ${user.username} has been ${user.isActive ? 'activated' : 'deactivated'}.`,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        }
    });
});
// ---------------------------------


module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    getUsers,
    deleteUser,       // <-- Ditambahkan
    toggleUserStatus, // <-- Ditambahkan
};