import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSearch from '../components/UserSearch';
import ChatWindow from '../components/ChatWindow';
import { io } from 'socket.io-client';

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
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-50 border-r flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700">ChatApp</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="p-4 border-b flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Recent Chats</h3>
          <ul>
            {recentChats.map((chat) => (
              <li
                key={chat._id}
                onClick={() => handleSelectContact(chat)}
                className={`p-3 rounded cursor-pointer ${
                  contact && contact._id === chat._id
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{chat.username}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage || 'Start a conversation'}
                  </p>
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

        <UserSearch token={token} onSelectUser={handleSelectContact} />
      </div>

      <div className="flex-1">
        {contact ? (
          <ChatWindow token={token} userId={userId} contact={contact} socket={socket} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
