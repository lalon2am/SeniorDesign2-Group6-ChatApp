// src/app/chat/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chat from './Chat';
import Friends from './Friends';
import styles from './chat.module.css';
import './chatGlobals.css';

export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', String(newTheme));
  };

  // Initialize theme and user data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load theme first
        const savedTheme = localStorage.getItem('theme') === 'true';
        setIsDarkMode(savedTheme);
        
        // Then load user data
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) setUser(localUser);

        const userResponse = await fetch('/api/auth/verify', { 
          credentials: 'include' 
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));

          const friendsResponse = await fetch(`/api/friends/list?userId=${userData.id}`, {
            credentials: 'include'
          });

          if (friendsResponse.ok) {
            const friendsData = await friendsResponse.json();
            setFriends(Array.isArray(friendsData) ? friendsData : []);
          }
        } else if (userResponse.status === 401) {
          // Handle unauthorized (not logged in)
          router.push('/login');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        if (error instanceof SyntaxError) {
          // Handle JSON parse error
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [router]);

  // const handleLogout = async () => {
  //   try {
  //     // First call your Spring Boot backend logout endpoint
  //     const backendResponse = await fetch('http://localhost:8080/api/auth/logout', {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  
  //     if (!backendResponse.ok) {
  //       throw new Error('Backend logout failed');
  //     }
  
  //     // Then clear frontend storage and redirect
  //     localStorage.removeItem('user');
  //     localStorage.removeItem('authToken');
  //     localStorage.removeItem('theme');
  //     router.push('/login');  // Redirect to login page
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //     // Even if logout fails, clear local storage and redirect
  //     localStorage.removeItem('user');
  //     localStorage.removeItem('authToken');
  //     localStorage.removeItem('theme');
  //     router.push('/login');
  //   }
  // };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    // Load messages for the selected friend
    if (user && friend) {
      fetch(`/api/chat/messages?userId=${user.id}&friendId=${friend.id}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setMessages(Array.isArray(data) ? data : []))
        .catch(err => console.error('Error loading messages:', err));
    }
  };

  if (loading) {
    return (
      <div className={`${styles.loading} ${isDarkMode ? styles.darkTheme : ''}`}>
        <div className={styles.loadingBubble}></div>
        <p>Bubbling...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${styles.loading} ${isDarkMode ? styles.darkTheme : ''}`}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.pageContainer} ${isDarkMode ? styles.darkTheme : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Bubble Chat</h1>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          {user && (
            <div className={styles.usernameGreeting}>
              Hi {user.username}!
            </div>
          )}
  
          {/* {user && (
            <button 
            onClick={handleLogout} 
            className={styles.logoutButton}>
            Logout
          </button>
          )} */}
        </div>
  
        <div className={styles.bubblesBackground}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className={`${styles.bubbleContainer} ${styles[`bubble${i}`]}`}>
              <div className={`${styles.bubble} ${styles.bubbleAnimationX} ${styles.bubbleAnimationY}`}></div>
            </div>
          ))}
        </div>
      </header>
    
      <main className={styles.main}>
        <div className={`${styles.chatContainer} ${styles.chatModule}`}>
          <Chat
            user={user}
            friends={friends}
            selectedFriend={selectedFriend}
            onSelectFriend={handleSelectFriend}
            messages={messages}
            setMessages={setMessages}
            isDarkMode={isDarkMode}
          />
        </div>
  
        <div className={styles.friendListContainer}>
          <Friends
            user={user}
            setFriends={setFriends}
            friends={friends}
            onSelectFriend={handleSelectFriend}
            isDarkMode={isDarkMode}
            selectedFriend={selectedFriend}
          />
        </div>
      </main>
    
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Bubble Chat</p>
      </footer>
    </div>
  );
}