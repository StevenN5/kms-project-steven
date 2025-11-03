const express = require('express');
const router = express.Router();
const { 
    getCategories, 
    createCategory, 
    deleteCategory 
} = require('../controllers/categoryController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// Public routes
router.get('/', getCategories);

// Protected admin routes
router.post('/', protect, admin, createCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;