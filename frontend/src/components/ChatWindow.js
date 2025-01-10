import React, { useState, useEffect } from 'react';
import { fetchChatHistory } from '../services/api';
import { io } from 'socket.io-client';

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
    <div>
      <h2>Chat with {contact.username}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender === userId ? 'You' : contact.username}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatWindow;
