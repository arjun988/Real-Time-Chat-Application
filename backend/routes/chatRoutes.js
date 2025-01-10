const express = require('express');
const { getChatHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:userId/:contactId', authMiddleware, getChatHistory);

module.exports = router;
