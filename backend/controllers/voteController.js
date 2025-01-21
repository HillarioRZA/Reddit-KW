const Vote = require('../models/vote');

// Create Vote
const createVote = async (req, res) => {
  const { userId, referenceId, referenceType, value } = req.body;

  try {
    // Cek apakah vote sudah ada
    const existingVote = await Vote.findOne({ userId, referenceId, referenceType });

    if (existingVote) {
      // Jika sudah ada, perbarui nilai vote
      existingVote.value = value;
      await existingVote.save();
      return res.status(200).json({ message: 'Vote updated successfully', vote: existingVote });
    }

    // Jika belum ada, buat vote baru
    const vote = new Vote({ userId, referenceId, referenceType, value });
    await vote.save();
    res.status(201).json({ message: 'Vote created successfully', vote });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Votes for Reference
const getVotesByReferenceId = async (req, res) => {
  const { referenceId, referenceType } = req.params;

  try {
    const votes = await Vote.find({ referenceId, referenceType });
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Vote
const deleteVote = async (req, res) => {
  const { voteId } = req.params;

  try {
    const vote = await Vote.findById(voteId);

    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    await vote.deleteOne();
    res.status(200).json({ message: 'Vote deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createVote, getVotesByReferenceId, deleteVote };
