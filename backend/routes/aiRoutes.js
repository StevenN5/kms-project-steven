const express = require('express');
const router = express.Router();
const { handleChatQuery } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

/**
 * @route   POST /api/ai/chat
 * @desc    AI Chatbot endpoint with RAG (Retrieval Augmented Generation)
 * @access  Private
 */
router.post('/chat', protect, handleChatQuery);

module.exports = router;