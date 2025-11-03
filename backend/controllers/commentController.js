const Comment = require('../models/commentModel.js');

// @desc    Get comments for a document
// @route   GET /api/comments/:documentId
const getCommentsForDocument = async (req, res) => {
    try {
        const comments = await Comment.find({ document: req.params.documentId })
            .populate('author', 'username')
            .sort({ createdAt: -1 }); // Urutkan dari yang terbaru
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new comment
// @route   POST /api/comments/:documentId
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const comment = new Comment({
            content: content.trim(),
            author: req.user._id,
            document: req.params.documentId,
        });
        
        const createdComment = await comment.save();
        const populatedComment = await Comment.findById(createdComment._id)
            .populate('author', 'username');
            
        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is the author or admin
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { 
    getCommentsForDocument, 
    addComment, 
    deleteComment 
};