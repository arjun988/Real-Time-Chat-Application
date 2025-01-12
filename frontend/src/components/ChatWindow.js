import React, { useState, useEffect, useRef } from 'react';
import { fetchChatHistory } from '../services/api';
import { io } from 'socket.io-client';
import { Send, User, Phone, Video, MoreVertical, Smile, Paperclip, Image, FileText } from 'lucide-react';

const socket = io('http://localhost:3001');

const ChatWindow = ({ token, userId, contact }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetchChatHistory(userId, contact._id, token);
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    loadChatHistory();

    socket.on('receive-message', (message) => {
      if (message.sender === contact._id || message.receiver === contact._id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    socket.on('user-typing', (typingData) => {
      if (typingData.sender === contact._id) {
        setIsTyping(true);
      }
    });

    socket.on('user-stop-typing', (typingData) => {
      if (typingData.sender === contact._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-typing');
      socket.off('user-stop-typing');
    };
  }, [userId, contact, token]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (value.trim() && !isTyping) {
      socket.emit('typing', { sender: userId, receiver: contact._id });
    } else if (!value.trim() && isTyping) {
      socket.emit('stop-typing', { sender: userId, receiver: contact._id });
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: userId,
      receiver: contact._id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    socket.emit('send-message', messageData);
    socket.emit('stop-typing', { sender: userId, receiver: contact._id });

    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Chat Header */}
      <div className="p-4 bg-white/10 backdrop-blur-sm border-b border-gray-100/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {contact.username}
              </h2>
              {isTyping && (
                <p className="text-sm text-blue-400 animate-pulse">
                  {contact.username} is typing...
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[70%] space-y-1">
              <div
                className={`p-3 rounded-2xl ${
                  msg.sender === userId
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    : 'bg-white/10 backdrop-blur-sm text-gray-100'
                } animate-fadeIn`}
              >
                {msg.text}
              </div>
              <div className={`text-xs text-gray-400 ${
                msg.sender === userId ? 'text-right' : 'text-left'
              }`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100/10">
        <div className="relative">
          <div className="flex gap-2 items-center">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                socket.emit('stop-typing', { sender: userId, receiver: contact._id });
              }}
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-gray-100/10 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Attachment Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
                  <Image className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;