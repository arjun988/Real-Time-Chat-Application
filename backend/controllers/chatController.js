// controllers/chatController.js
const Message = require('../models/Message');
const User = require('../models/User'); // Assuming you have a User model

exports.getChatHistory = async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentChats = async (req, res) => {
  try {
    const userId = req.user._id; // Get logged-in user's ID from auth middleware

    // Find all messages where the user is either sender or receiver
    const messages = await Message.aggregate([
      {
        $match: {
          $and: [
            // Match messages where user is either sender or receiver
            {
              $or: [
                { sender: mongoose.Types.ObjectId(userId) },
                { receiver: mongoose.Types.ObjectId(userId) }
              ]
            },
            // Exclude messages where sender and receiver are the same
            {
              $expr: {
                $ne: ['$sender', '$receiver']
              }
            }
          ]
        }
      },
      // Sort by timestamp descending to get most recent messages first
      { $sort: { timestamp: -1 } },
      // Group by the conversation partner (other user)
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
              then: '$receiver',
              else: '$sender'
            }
          },
          lastMessage: { $first: '$text' },
          lastMessageTime: { $first: '$timestamp' },
          // Count unread messages (only where user is receiver)
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', mongoose.Types.ObjectId(userId)] },
                    { $ne: ['$read', true] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      // Lookup user details for the conversation partner
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      // Reshape the output
      {
        $project: {
          _id: 1,
          username: { $arrayElemAt: ['$userDetails.username', 0] },
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      }
    ]);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { contactId } = req.params;

    await Message.updateMany(
      {
        sender: contactId,
        receiver: userId,
        read: { $ne: true }
      },
      {
        $set: { read: true }
      }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};