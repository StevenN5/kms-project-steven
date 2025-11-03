 
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Document',
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;