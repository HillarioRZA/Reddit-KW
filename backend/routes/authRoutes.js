const express = require('express');
const { registerUser, loginUser, updateUser, getUserById, deleteUser } = require('../controllers/authController');
const router = express.Router();

// Register dan Login
router.post('/register', registerUser);
router.post('/login', loginUser);

// CRUD User
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
