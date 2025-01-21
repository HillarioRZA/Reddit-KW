const express = require('express');
const {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');

const router = express.Router();

// Routes untuk Topic
router.post('/', createTopic); // Buat topik baru
router.get('/', getAllTopics); // Ambil semua topik
router.get('/:topicId', getTopicById); // Ambil topik berdasarkan ID
router.put('/:topicId', updateTopic); // Update topik
router.delete('/:topicId', deleteTopic); // Hapus (soft delete) topik

module.exports = router;
