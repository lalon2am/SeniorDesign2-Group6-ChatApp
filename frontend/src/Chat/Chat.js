import './Chat.css';
import Message from '../Message/Message';
import React, { useEffect, useState } from 'react';

function Chat({ isOpen }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);

  const loadMessages = async () => {
    try {
      const response = await fetch('https://cps410chatappbackenddev.onrender.com/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        // set id's for messages received
        for (let i = 0; i < json.length; i++) {
          json[i].id = i;
        }
        setMessages(json);
      } else {
        console.error('Failed to load messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(true);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

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
    <h2>Messages</h2>
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
