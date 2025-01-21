const express = require('express');
const {
  createComment,
  getCommentsByTopicId,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const router = express.Router();

// Routes untuk Comments
router.post('/', createComment); // Buat komentar baru
router.get('/:topicId', getCommentsByTopicId); // Ambil komentar berdasarkan ID topik
router.put('/:commentId', updateComment); // Update komentar
router.delete('/:commentId', deleteComment); // Soft delete komentar

module.exports = router;
