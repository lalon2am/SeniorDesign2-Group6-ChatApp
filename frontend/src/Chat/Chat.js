// src/Chat.js
import React, { useState, useEffect } from 'react';
import Message from "../Message/Message";
import "../Chat/Chat.css";
import "../Message/Message.css";


const Chat = ({ user, messages, friend }) => {
  const [newMessage, setNewMessage] = useState('');

  // Scroll to the bottom of the chat when a new message is sent
  const scrollToBottom = () => {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  // Send a new message when user presses enter
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logic to send a new message here
      setNewMessage('');
    }
  };

  useEffect(() => {
    scrollToBottom();  // Automatically scroll when new messages are received
  }, [messages]);

  return (
    <div className="chat-container">
      {/* Chat header with friend's name */}
      <div className="chat-header">
        <h2>{friend.name}</h2> {/* Displaying the friend's name */}
      </div>

      <div id="chat-messages" className="chat-messages">
        {messages.map((message, index) => (
          <Message key={index} message={message} user={user} />
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
