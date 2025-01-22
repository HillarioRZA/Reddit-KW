const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const commentController = require('./controllers/commentController');
const commentRoutes = require('./routes/commentRoutes');
const voteRoutes = require('./routes/voteRoutes');
const userTopicFollowRoutes = require('./routes/userTopicFollowRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust as needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

commentController.setSocketIO(io);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes(io));
app.use('/api/user-topic-follows', userTopicFollowRoutes);
app.use('/api/categories', categoryRoutes); 

// Database connection
connectDB();

// Socket.IO configuration
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

// Start server
const port = 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));
