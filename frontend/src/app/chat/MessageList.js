// src/app/chat/MessageList.js
'use client';
import React, { useState, useEffect } from 'react';
import styles from './chat.module.css';

function MessageList({ user, friend }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user?.id || !friend?.id) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/conversation?user1=${user.id}&user2=${friend.id}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages:', response.status);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, [user?.id, friend?.id]);

  return (
    <div className={styles.messages}>
      {messages.length === 0 ? (
        <p className={styles.noMessages}>No messages yet. Start the conversation!</p>
      ) : (
        messages.map((msg) => {
          // Determine if the message was sent by the current user
          const isCurrentUserSender = msg.sender === user.id; // More descriptive variable name

          console.log("Message ID:", msg.id);
          console.log("msg.sender:", msg.sender);
          console.log("user.id:", user.id);
          console.log("isCurrentUserSender:", isCurrentUserSender);
          console.log("Message:", msg.message);

          return (
            <div
              key={msg.id}
              className={`${styles.message} ${
                isCurrentUserSender ? styles.sentMessage : styles.receivedMessage
              }`}
            >
              <p>{msg.message}</p>
              <div className={styles.messageMeta}>
                <span className={styles.timestamp}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isCurrentUserSender && (
                  <span className={styles.messageStatus}>
                    {msg.status === 'delivered' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MessageList;