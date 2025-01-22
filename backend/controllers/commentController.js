const Comment = require('../models/Comment');

let io; // Variable untuk menyimpan instance Socket.IO

// Mengatur instance Socket.IO
const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Create Comment
const createComment = async (req, res) => {
  const { userId, topicId, content, replyTo } = req.body;

  try {
    const comment = new Comment({ userId, topicId, content, replyTo });
    await comment.save();

    // Emit event ke semua client untuk pembaruan komentar
    io.emit('newComment', comment);

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Comments for a Topic
const getCommentsByTopicId = async (req, res) => {
  const { topicId } = req.params;

  try {
    const comments = await Comment.find({ topicId, isDeleted: false })
      .populate('userId', 'username avatarUrl') // Populate user details
      .populate('replyTo', 'content'); // Populate parent comment content

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Comment
const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.content = content || comment.content;
    await comment.save();

    // Emit event ke semua client untuk pembaruan komentar
    io.emit('updateComment', comment);

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Soft Delete Comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.isDeleted = true;
    await comment.save();

    // Emit event ke semua client untuk pemberitahuan penghapusan
    io.emit('deleteComment', { commentId });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByTopicId,
  updateComment,
  deleteComment,
  setSocketIO, // Untuk mengatur instance Socket.IO
};
