//frontend/src/app/chat/Friends.js
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './chat.module.css';
import './chatGlobals.css';
import PropTypes from 'prop-types';

function Friends({ user, onSelectFriend, isDarkMode, selectedFriend }) {
  const [friends, setFriends] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isResponding, setIsResponding] = useState(false);
  const [showRequestsPopup, setShowRequestsPopup] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isAddingFriend, setIsAddingFriend] = useState(null);

  const currentUserId = user?.id || user?.userId;

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'x-user-id': currentUserId || ''
      };

      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.error || 
          `Request failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }, [currentUserId]);

  const searchUsers = useCallback(async () => {
    if (!inputValue.trim()) {
      setError('Please enter a username or email');
      return;
    }

    if (inputValue.trim().length < 2) {
      setError('Search query must be at least 2 characters');
      return;
    }

    setSearchLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(
        `/api/friends/search?query=${encodeURIComponent(inputValue)}`
      );
      setSearchResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [inputValue, fetchWithAuth]);

  const loadFriendList = useCallback(async () => {
    if (!currentUserId) return;
  
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/api/friends/list?userId=${currentUserId}`);
      
      // Handle response and ensure unique friends
      const friendsData = Array.isArray(response) ? response : 
                         (Array.isArray(response?.friends) ? response.friends : []);
      
      // Create a map to ensure uniqueness by friend ID
      const uniqueFriendsMap = new Map();
      friendsData.forEach(friend => {
        if (friend?.id) {
          uniqueFriendsMap.set(friend.id, {
            id: friend.id,
            username: friend.username,
            status: friend.status || 'offline',
            friendshipId: friend.friendship_id // Include this if available
          });
        }
      });
      
      setFriends(Array.from(uniqueFriendsMap.values()));
      
    } catch (err) {
      console.error('Error loading friends:', err);
      setError('Failed to load friends. Please try again.');
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, fetchWithAuth]);

  const handleAddFriend = async (friendId) => {
    try {
      if (!currentUserId) {
        throw new Error('Please log in to send friend requests');
      }

      if (friendId === currentUserId) {
        throw new Error('You cannot add yourself as a friend');
      }

      // Check if already friends
      if (friends.some(f => f.id === friendId)) {
        throw new Error('This user is already your friend');
      }

      // Check for pending requests
      if (pendingRequests.some(r => 
        (r.senderId === friendId && r.recipientId === currentUserId) ||
        (r.senderId === user.userId && r.recipientId === friendId)
      )) {
        throw new Error('Friend request already pending');
      }

      setIsAddingFriend(friendId);
      setError(null);

      const response = await fetchWithAuth('/api/friends/request', {
        method: 'POST',
        body: JSON.stringify({
          senderId: currentUserId,
          recipientId: friendId
        })
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to send friend request');
      }

      // Update UI
      setSearchResults(prev => prev.filter(u => u.id !== friendId));
      setError({
        type: 'success',
        message: 'Friend request sent successfully!'
      });

      // Refresh data
      await loadPendingRequests();
      await loadFriendList();

    } catch (err) {
      console.error('[ERROR] Friend request failed:', err);
      setError({
        type: 'error',
        message: err.message || 'Failed to send friend request'
      });
    } finally {
      setIsAddingFriend(null);
    }
  };

  useEffect(() => {
    loadFriendList();
  }, [loadFriendList]);

  const loadPendingRequests = useCallback(async () => {
    if (!currentUserId) return;
    
    try {
      const data = await fetchWithAuth(`/api/friends/requests?userId=${currentUserId}`);
      setPendingRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      console.error('Failed to load pending requests:', err);
      setPendingRequests([]);
    }
  }, [currentUserId, fetchWithAuth]);

  const respondToRequest = async (requestId, action) => {
    setIsResponding(true);
    try {
      await fetchWithAuth('/api/friends/respond', {
        method: 'POST',
        body: JSON.stringify({ requestId, action })
      });
      await loadPendingRequests();
      await loadFriendList();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResponding(false);
    }
  };

  // Load data
  useEffect(() => {
    if (currentUserId) {
      loadFriendList();
      loadPendingRequests();
      const interval = setInterval(() => {
        loadFriendList();
        loadPendingRequests();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUserId, loadFriendList, loadPendingRequests]);
  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      // Clear client-side storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
  
      // Redirect to login page with full page reload to clear state
      window.location.href = '/';
    } catch (error) {
      setError({
        type: 'error',
        message: error.message || 'Failed to logout'
      });
    }
  };
return (
    <div className={`${styles.friendsSection} ${isDarkMode ? 'dark' : 'light'}`}>
      <button 
        onClick={handleLogout}
        className={styles.logoutButton}
        title="Log out of your account"
      >
        Logout
      </button>
      <h2 className={styles.friendsSectionTitle}>Friends</h2>
      
      {error && (
        <div className={`${styles.messageBanner} ${
          error.type === 'success' ? styles.successBanner : styles.errorBanner
        }`}>
          {error.message}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className={styles.searchSection}>
        <h3>Add Friends 👋</h3>
        <div className={styles.friendInputContainer}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by username or email"
            className={styles.friendInput}
            onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
          />
          <button 
            onClick={searchUsers} 
            className={styles.searchButton}
            disabled={!inputValue.trim() || inputValue.trim().length < 2}
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchLoading ? (
          <div className={styles.loadingText}>Searching...</div>
        ) : searchResults.length > 0 ? (
          <div className={styles.searchResults}>
            {searchResults.map(resultUser => (
              <div key={resultUser.id} className={styles.searchResultItem}>
                <div className={styles.userInfo}>
                  <span className={styles.username}>{resultUser.username}</span>
                  {resultUser.email && (
                    <span className={styles.email}>{resultUser.email}</span>
                  )}
                  {resultUser.id === currentUserId&& (
                    <span className={styles.selfIndicator}>(yourself)</span>
                  )}
                </div>
                {resultUser.id === currentUserId ? (
                  <span className={styles.disabledAdd} aria-label="Your own profile">(self)</span>
                ) : (
                  <button 
                    className={styles.addFriendButton}
                    onClick={() => handleAddFriend(resultUser.id)}
                    disabled={isAddingFriend === resultUser.id}
                  >
                    {isAddingFriend === resultUser.id ? (
                      <span className={styles.loadingSpinner} />
                    ) : 'Add'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          inputValue && !searchLoading && <p className={styles.noResults}>No users found</p>
        )}
      </div>

      <div className={styles.friendsListSection}>
      <h3>Your Friends 👥</h3>
        {isLoading ? (
          <div className={styles.loadingText}>Loading friends...</div>
        ) : friends.length === 0 ? (
          <p className={styles.noFriends}>No friends yet. Start by searching!</p>
        ) : (
          <ul className={styles.friendsList}>
            {friends.map(friend => (
              <li 
                key={friend.id}
                className={`${styles.friendItem} ${
                  selectedFriend?.id === friend.id ? styles.selectedFriend : ''
                }`}
                onClick={() => {
                  onSelectFriend(friend); // This will trigger the chat to open
                }}
              >
                <div className={styles.friendInfo}>
                  <span className={styles.friendName}>{friend.username}</span>
                  {friend.status && (
                    <span className={styles.friendStatus} data-status={friend.status}>
                      {friend.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                    </span>
                  )}
                </div>
                {friend.isNew && (
                  <span className={styles.newFriendBadge}>New!</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.friendRequests}>
        <h3>Friend Requests <span className={styles.emoji}>🔔</span></h3>
        <button
          className={styles.requestNotificationButton}
          onClick={() => setShowRequestsPopup(true)}
          disabled={isResponding}
        >
          {isResponding ? (
            <span className={styles.loadingText}>Loading...</span>
          ) : (
            `Requests (${pendingRequests.length})`
          )}
        </button>
  
        {showRequestsPopup && (
          <div className={styles.requestsPopup}>
            <div className={styles.popupContent}>
              <h3>Friend Requests</h3>
              {pendingRequests.length === 0 ? (
                <p>No pending requests</p>
              ) : (
                <ul className={styles.requestsList}>
                  {pendingRequests.map(request => (
                    <li key={request.id} className={styles.requestItem}>
                      <div className={styles.requestInfo}>
                        <span>{request.senderUsername || 'Unknown User'}</span>
                        <span className={styles.requestTime}>
                          {new Date(request.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className={styles.requestActions}>
                        <button 
                          className={`${styles.acceptButton} ${styles.requestActionButton}`}
                          onClick={() => respondToRequest(request.id, 'accept')}
                          disabled={isResponding}
                        >
                          {isResponding ? '...' : 'Accept'}
                        </button>
                        <button 
                          className={`${styles.declineButton} ${styles.requestActionButton}`}
                          onClick={() => respondToRequest(request.id, 'decline')}
                          disabled={isResponding}
                        >
                          {isResponding ? '...' : 'Decline'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button 
                className={styles.popupCloseButton}
                onClick={() => setShowRequestsPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Friends.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string
  }),
  onSelectFriend: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  selectedFriend: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string
  })
};

Friends.defaultProps = {
  isDarkMode: false,
  selectedFriend: null
};

export default Friends;