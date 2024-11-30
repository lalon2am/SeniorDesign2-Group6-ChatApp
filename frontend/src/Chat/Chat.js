import './Chat.css';
import Message from '../Message/Message';
import React, { useEffect, useState } from 'react';

function Chat({ isOpen, friend, loadMessages, messages }) {

  const [error, setError] = useState(false);


  useEffect(() => {
    if (isOpen) {
      const intervalId = setInterval(() => loadMessages(friend), 3000);
      loadMessages(friend);
      return () => clearInterval(intervalId);
    }
  }, [isOpen, friend, loadMessages]);

  if (!isOpen) return null;

  if (error) return (
    <div>
      <h2>Messages</h2>
      <div>
        <h3>Unable to load messages at this time.</h3>
      </div>
    </div>
  );

  if (messages.length == 0) return (
    <div>
      <h2>Messages</h2>
      <div>
        <h3>Loading...</h3>
      </div>
    </div>
  );

  return (<div>

    <h2>{friend.friendEmail}</h2>
    <div>
      {messages.map((message) => {
        const date = new Date(message.timestamp);
        const formattedTime = `${date.toLocaleDateString()}`;
        return (
          <Message
            key={message.id}
            text={message.text}
            user={message.user}
            timestamp={formattedTime}
          />

        );
      })}
    </div>
  </div>);

}

export default Chat;
