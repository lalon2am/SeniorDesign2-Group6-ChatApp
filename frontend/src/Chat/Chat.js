import './Chat.css';
import Message from '../Message/Message';
import React, { useEffect, useState } from 'react';

function Chat({ isOpen }) {
  const [messages, setMessages] = useState([]);
  const loadMessages = async () => {
    try {
      const response = await fetch('https://localhost:8080/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        setMessages(json);
      } else {
        console.error('Failed to load messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (messages.length == 0) return (
    <div>
      <h2>Messages</h2>
      <div>
        <h3>Loading...</h3>
      </div>
    </div>
  );

  return (<div>
    <h2>Messages</h2>
    <div>
      {messages.map((message) => {
        const date = new Date(message.timestamp);
        const formattedTime = `${date.toLocaleDateString()}`;
        return (
          <Message
            key={message.id}
            text={message.text}
            user={message.sender}
            timestamp={formattedTime}
          />

        );
      })}
    </div>
  </div>);

}

export default Chat;
