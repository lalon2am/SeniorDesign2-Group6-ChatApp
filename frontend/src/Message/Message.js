import React from 'react';
import './Message.css'; // Import message bubble and related styles


const Message = ({ message, user }) => {
  // Check if the message was sent by the user or a friend
  const isUserMessage = message.senderId === user.id;

  return (
    <div className={`message ${isUserMessage ? 'user-message' : 'friend-message'}`}>
      {!isUserMessage && message.sender && (
        <div className="profile-pic">
          <img src={message.sender.profilePic} alt="profile" />
        </div>
      )}
      <p>{message.text}</p>
      <span className="message-time">{message.timestamp}</span>
    </div>
  );
};

export default Message;
