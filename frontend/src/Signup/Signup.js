import './Signup.css';
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../firebase'; // Ensure you import your Firestore instance
import { doc, setDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore'; // Import necessary Firestore functions
import { saveUserToFirestore } from '../firestoreService';

function Signup({ isOpen, onClose, handleSignUp, setName }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose} className="close-button">Return to login menu</button>
                <h2>Enter new account details</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="signup-box">
                    <p>Username: </p>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p>Email: </p>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p>Password: </p>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={() => { handleSignUp(username, email, password) }}>Make new Account</button>
                </div>

            </div>
        </div>
    );
}

export default Signup;

