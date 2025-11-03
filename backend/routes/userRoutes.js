const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    getUsers,
    deleteUser,       // <-- Impor fungsi baru
    toggleUserStatus, // <-- Impor fungsi baru
} = require('../controllers/userController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// Rute Admin: GET /api/users
router.route('/').get(protect, admin, getUsers);

// Rute Profil: GET & PUT /api/users/profile
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Rute Ganti Password: PUT /api/users/change-password
router.put('/change-password', protect, updateUserPassword);


// --- TAMBAHKAN RUTE BARU INI ---

// @desc    Delete user (Admin) & Toggle Status (Admin)
// @route   DELETE /api/users/:id
// @route   PUT /api/users/:id/toggle-status
router
    .route('/:id')
    .delete(protect, admin, deleteUser);

router
    .route('/:id/toggle-status')
    .put(protect, admin, toggleUserStatus);

// ---------------------------------

module.exports = router;