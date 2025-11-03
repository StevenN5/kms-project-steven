const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { 
    getCommentsForDocument, 
    addComment, 
    deleteComment 
} = require('../controllers/commentController');

router.route('/:documentId')
    .get(getCommentsForDocument)
    .post(protect, addComment);

router.route('/:commentId')
    .delete(protect, deleteComment);

module.exports = router;