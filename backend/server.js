const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const commentRoutes = require('./routes/commentRoutes');
const voteRoutes = require('./routes/voteRoutes');
const userTopicFollowRoutes = require('./routes/userTopicFollowRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/user-topic-follows', userTopicFollowRoutes);

// Database connection
connectDB()

// Start server
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));