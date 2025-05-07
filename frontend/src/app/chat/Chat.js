// src/app/chat/Chat.js
'use client';
import React, { useState, useEffect } from 'react';
import Friends from './Friends';
import MessageList from './MessageList';
import Send from './Send';
import styles from './chat.module.css';
import './chatGlobals.css';
import { fetchMessages } from '@lib/auth';

function Chat({ user, isDarkMode, toggleDarkMode }) {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const userRoutes = require('./frontend/src/app/api/users'); // Removed incorrect require

    // Load messages when friend is selected
    useEffect(() => {
        if (!selectedFriend || !user?.id) return;

        const loadMessages = async () => {
            setLoading(true);
            setError(null);

            try {
                const messages = await fetchMessages(user.id, selectedFriend.id);
                setMessages(messages);
            } catch (error) {
                console.error('Failed to load messages:', error);
                setError(error.message || 'Failed to load messages');
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();

        // Cleanup function
        return () => {
            // Cancel any pending requests if component unmounts
            setLoading(false);
        };
    }, [selectedFriend, user?.id]);

    // Handle new message sent
    const handleMessageSent = (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
    };

    return (
        <div className={`${styles.chatContainer} ${isDarkMode ? styles.darkTheme : styles.lightTheme}`}>
            <div className={styles.sidePanel}>
                <Friends
                    user={user}
                    friends={friends}
                    selectedFriend={selectedFriend}
                    onSelectFriend={setSelectedFriend}
                    isDarkMode={isDarkMode}
                />
            </div>

            <div className={styles.chatBox}>
                {selectedFriend ? (
                    <>
                        <div className={styles.chatHeader}>
                            <h2>{selectedFriend.username}</h2>
                            <span className={styles.friendStatus} data-status={selectedFriend.status}>
                                {selectedFriend.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                            </span>
                        </div>

                        {loading ? (
                            <div className={styles.loadingMessages}>
                                <div className={styles.spinner}></div>
                                <p>Loading messages...</p>
                            </div>
                        ) : error ? (
                            <div className={styles.errorMessage}>
                                <p>{error}</p>
                                <button
                                    onClick={() => setError(null)}
                                    className={styles.retryButton}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.messages}>
                                    <MessageList
                                        user={user}
                                        friend={selectedFriend}
                                        messages={messages}
                                    />
                                </div>

                                <div className={styles.messageInput}>
                                    {user && selectedFriend && ( // Conditionally render Send
                                        <Send
                                            user={user}
                                            friend={selectedFriend}
                                            onMessageSent={handleMessageSent}
                                        />
                                    )}

                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className={styles.noChatSelected}>
                        <p>Select a friend to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;