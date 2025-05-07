// src/app/chat/Send.js
'use client';

import React, { useState, useEffect } from 'react';
import styles from './chat.module.css';
import { sendMessage } from '@lib/auth';

function Send({ user, friend, onMessageSent }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [localUserId, setLocalUserId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setLocalUserId(user.id);
      setIsReady(true);
    } else {
      setLocalUserId(null);
      setIsReady(false);
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!localUserId || !friend?.id) {
      setError('User or friend information missing.');
      return;
    }

    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await sendMessage(localUserId, friend.id, message); // Pass individual arguments
      setMessage('');
      if (onMessageSent) {
        onMessageSent({ sender: localUserId, recipient: friend.id, message });
      }
    } catch (err) {
      console.error('Message send error:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.messageInputContainer}>
      {error && (
        <div className={styles.errorMessage}>
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss error" className={styles.errorDismiss}>×</button>
        </div>
      )}
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={friend ? `Message ${friend.username}...` : "Select a friend to chat with..."}
          disabled={!friend || !isReady || sending || !localUserId}
          className={styles.messageInputField}
          aria-label="Type your message"
          maxLength={5000}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || !friend || !isReady || sending || !localUserId}
          className={`${styles.sendButton} ${sending ? styles.sending : ''}`}
          aria-label={sending ? "Sending message" : "Send message"}
        >
          {sending ? <span className={styles.spinner} aria-hidden="true" /> : 'Send'}
        </button>
      </div>
      <div className={styles.messageLengthIndicator}>{message.length}/5000</div>
    </div>
  );
}

export default Send;