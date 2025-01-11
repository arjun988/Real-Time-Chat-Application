const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

// Import Message model if it's defined elsewhere
const Message = require('./models/Message');
const User =require('./models/User');
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
// In server.js, update the socket.io message handling:

// In server.js, update the socket message handling:

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('send-message', async (data) => {
    const { sender, receiver, text } = data;
    try {
      // Don't process messages sent to self
      if (sender === receiver) {
        return;
      }

      // Create and save the message
      const message = new Message({ sender, receiver, text });
      await message.save();

      // Lookup sender's username
      const senderUser = await User.findById(sender);
      
      // Emit the message to the receiver's room
      io.to(receiver).emit('receive-message', {
        sender,
        senderName: senderUser.username,
        content: text,
        timestamp: message.timestamp
      });

      // Also emit back to sender but with receiver's info for chat list update
      const receiverUser = await User.findById(receiver);
      io.to(sender).emit('message-sent', {
        receiver,
        receiverName: receiverUser.username,
        content: text,
        timestamp: message.timestamp
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
