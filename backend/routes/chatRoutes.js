// routes/chatRoutes.js
const express = require('express');
const { 
  getChatHistory, 
  getRecentChats, 
  markMessagesAsRead 
} = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get chat history between two users
router.get('/:userId/:contactId', authMiddleware, getChatHistory);

// Get recent chats for logged-in user
router.get('/recent', authMiddleware, getRecentChats);

// Mark messages as read
router.post('/:contactId/read', authMiddleware, markMessagesAsRead);

module.exports = router;