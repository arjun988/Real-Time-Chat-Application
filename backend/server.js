const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

// Import Message model if it's defined elsewhere
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  // Allow requests from the frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

app.use(cors());  // Use CORS middleware for express API
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Handle socket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle sending messages
  socket.on('send-message', async (data) => {
    const { sender, receiver, text } = data;
    const message = new Message({ sender, receiver, text });
    await message.save();
    io.to(receiver).emit('receive-message', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
