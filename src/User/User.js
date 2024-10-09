import React from 'react';
import './User.css'; // Ensure you have styles for User component

function User() {
  // Replace with actual user data logic
  const userData = {
    username: 'User123', // Placeholder username
    email: 'user@example.com', // Placeholder email
    friends: ['Friend1', 'Friend2', 'Friend3'], // Placeholder friends list
  };

  return (
    <div className="User">
      <h2>User Profile</h2>
      <div className="user-info">
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <h3>Friends List:</h3>
        <ul>
          {userData.friends.map((friend, index) => (
            <li key={index}>{friend}</li>
          ))}
        </ul>
      </div>
      <button onClick={() => console.log('Edit Profile')}>Edit Profile</button>
    </div>
  );
}

export default User;