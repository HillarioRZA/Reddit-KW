const express = require('express');
const { createVote, getVotesByReferenceId, deleteVote } = require('../controllers/voteController');

const router = express.Router();

// Routes untuk Votes
router.post('/', createVote); // Buat atau perbarui vote
router.get('/:referenceId/:referenceType', getVotesByReferenceId); // Ambil semua vote berdasarkan referensi
router.delete('/:voteId', deleteVote); // Hapus vote

module.exports = router;
