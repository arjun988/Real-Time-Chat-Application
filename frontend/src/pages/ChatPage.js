import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSearch from '../components/UserSearch';
import ChatWindow from '../components/ChatWindow';
import { io } from 'socket.io-client';
import { LogOut, MessageSquare, User } from 'lucide-react';
const socket = io('http://localhost:3001');

const ChatPage = ({ token, userId }) => {
  const [contact, setContact] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Load recent chats and chat history on mount
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        // Fetch chat history from your backend
        const response = await fetch('http://localhost:3001/api/chats/recent', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Sort chats by most recent message timestamp
          const sortedChats = data.sort((a, b) => 
            new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
          );
          setRecentChats(sortedChats);
          
          // Initialize unread counts
          const unreadCounts = {};
          data.forEach(chat => {
            unreadCounts[chat._id] = chat.unreadCount || 0;
          });
          setUnreadMessages(unreadCounts);
        }
      } catch (error) {
        console.error('Error fetching recent chats:', error);
      }
    };

    fetchRecentChats();
  }, [token]);

  // Join user's room and listen for messages
  useEffect(() => {
    if (userId) {
      socket.emit('join-room', userId);
    }
    
    socket.on('receive-message', (message) => {
      const senderId = message.sender;

      // Only update the recent chats with messages received from others
      if (senderId !== userId) {
        setRecentChats(prev => {
          const existingChatIndex = prev.findIndex(chat => chat._id === senderId);
          const updatedChats = [...prev];
          
          const chatUpdate = {
            _id: senderId,
            username: message.senderName || 'Unknown',
            lastMessage: message.content, // Now correctly using message.content
            lastMessageTime: message.timestamp || new Date().toISOString()
          };

          if (existingChatIndex !== -1) {
            // Move existing chat to top and update last message
            updatedChats.splice(existingChatIndex, 1);
            updatedChats.unshift({
              ...prev[existingChatIndex],
              ...chatUpdate
            });
          } else {
            // Add new chat to top
            updatedChats.unshift(chatUpdate);
          }

          // Save to localStorage for persistence
          localStorage.setItem('recentChats', JSON.stringify(updatedChats));
          return updatedChats;
        });

        // Update unread counts
        if (!contact || contact._id !== senderId) {
          setUnreadMessages(prev => {
            const newCounts = {
              ...prev,
              [senderId]: (prev[senderId] || 0) + 1
            };
            return newCounts;
          });
        }
      }
    });
  
    return () => socket.off('receive-message');
  }, [userId, contact]);

  const handleSelectContact = async (user) => {
    setContact(user);
    setUnreadMessages(prev => ({
      ...prev,
      [user._id]: 0
    }));

    socket.emit('join-room', user._id);

    // Mark messages as read in backend
    try {
      await fetch(`http://localhost:3001/api/chats/${user._id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-96 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 flex flex-col">
        <div className="p-6 border-b border-gray-200/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Messages
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 text-gray-600 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Chats</h3>
            <ul className="space-y-2">
              {recentChats.map((chat) => (
                <li
                  key={chat._id}
                  onClick={() => handleSelectContact(chat)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                    contact && contact._id === chat._id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${
                      contact && contact._id === chat._id
                        ? 'bg-white/20'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    } flex items-center justify-center`}>
                      <User className={`w-5 h-5 ${
                        contact && contact._id === chat._id
                          ? 'text-white'
                          : 'text-white'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${
                          contact && contact._id === chat._id
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}>
                          {chat.username}
                        </span>
                        <span className={`text-xs ${
                          contact && contact._id === chat._id
                            ? 'text-white/80'
                            : 'text-gray-500'
                        }`}>
                          {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${
                        contact && contact._id === chat._id
                          ? 'text-white/80'
                          : 'text-gray-600'
                      }`}>
                        {chat.lastMessage || 'Start a conversation'}
                      </p>
                    </div>
                    {unreadMessages[chat._id] > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadMessages[chat._id]}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200/50">
          <UserSearch token={token} onSelectUser={handleSelectContact} />
        </div>
      </div>

      <div className="flex-1">
        {contact ? (
          <ChatWindow token={token} userId={userId} contact={contact} socket={socket} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <p className="text-xl font-medium text-gray-600">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
