import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { getAuth, signOut } from 'firebase/auth'; // Adjust the path as needed
import { doc, getDoc } from 'firebase/firestore';
import './Session.css';
import Auth from '../Auth/Auth';
function Session({ isOpen, onLogout, setAuthOpen }) {
  const [username, setUsername] = useState(''); // Replace with actual username logic
  
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the currently logged-in user
      if (user) {
        // Replace 'users' with your Firestore collection name
        const userDoc = doc(firestore, 'users', user.uid); 
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          setUsername(userData.data().username); // Assuming you have a 'username' field in Firestore
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
    };

    fetchUserData();
  }, []);
  if (!isOpen) return null;

  const handleLogout = async() => {
    try {
            await signOut(auth); // Sign out the user
            setUser(null); // Clear user information
            window.location.href = '/auth';
            alert('Logout successful!');
        } catch (error) {
            alert('Logout failed, please try again');
        }
    };

  if (!isOpen) return null;

  return (
    <div className="Session">
    <header className="Session-header">
      <div className="user-info">
        <h1 style={{ color: 'lavender', fontSize: '14px' }}>
          Welcome{username ? ` back, ${username}` : ''}!
        </h1>
      </div>
    </header>
      
      
    </div>
  );
}

export default Session;