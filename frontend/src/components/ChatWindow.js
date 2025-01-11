import React, { useState, useEffect } from 'react';
import { fetchChatHistory } from '../services/api';
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';

const socket = io('http://localhost:3001');

const ChatWindow = ({ token, userId, contact }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetchChatHistory(userId, contact._id, token);
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadChatHistory();

    socket.on('receive-message', (message) => {
      if (message.sender === contact._id || message.receiver === contact._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off('receive-message');
  }, [userId, contact, token]);

  const handleSend = () => {
    const messageData = {
      sender: userId,
      receiver: contact._id,
      text: newMessage,
    };
    socket.emit('send-message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold p-4 bg-blue-500 text-white">
        Chat with {contact.username}
      </h2>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.sender === userId ? 'bg-blue-100 self-end' : 'bg-gray-100'
            }`}
          >
            <strong>{msg.sender === userId ? 'You' : contact.username}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center p-4 border-t">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
