import './Signup.css';
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../firebase'; // Ensure you import your Firestore instance
import { doc, setDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore'; // Import necessary Firestore functions
import { saveUserToFirestore } from '../firestoreService';

function Signup({ isOpen, onClose }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        if (!username || !email || !password) {
            alert('All fields are required');
            return;
        }

        const auth = getAuth();
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if the user already exists in Firestore
            const userQuery = query(collection(firestore, 'users'), where('uid', '==', user.uid));
            const userDocs = await getDocs(userQuery);

            if (!userDocs.empty) {
                alert('User already exists.');
                return; // Stop execution if user already exists
            }

            // Save user data in Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
                uid: user.uid,
                username: username,
                email: user.email,
            });

            //const userCollection = collection(firestore, 'users');
            //await addDoc(userCollection, {
            //    uid: user.uid,
            //    username,
            //    email,
            //});

            alert('Account created successfully!');
            console.log('User signed up and added to Firestore:', user.uid);
            onClose(); // Close modal after successful signup
        } catch (error) {
            setError(error.message);
            console.error('Sign-up error:', error);
        }
    };

    const handleGoogleSignup = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if the user already exists in Firestore
            const userQuery = query(collection(firestore, 'users'), where('uid', '==', user.uid));
            const userDocs = await getDocs(userQuery);

            if (!userDocs.empty) {
                alert('User already exists.');
                return; // Stop execution if user already exists
            }

            // Save user data in Firestore
            const userCollection = collection(firestore, 'users');
            await addDoc(userCollection, {
                uid: user.uid,
                username: user.displayName || username, // Use display name or the provided username
                email: user.email,
            });

            alert('Account created successfully with Google!');
            onClose(); // Close modal after successful signup
        } catch (error) {
            setError(error.message);
            console.error('Google sign-up error:', error);
        }
    };

    const handleGithubSignup = async () => {
        const auth = getAuth();
        const provider = new GithubAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if the user already exists in Firestore
            const userQuery = query(collection(firestore, 'users'), where('uid', '==', user.uid));
            const userDocs = await getDocs(userQuery);

            if (!userDocs.empty) {
                alert('User already exists.');
                return; // Stop execution if user already exists
            }

            // Save user data in Firestore
            const userCollection = collection(firestore, 'users');
            await addDoc(userCollection, {
                uid: user.uid,
                username: user.displayName || username, // Use display name or the provided username
                email: user.email,
            });

            alert('Account created successfully with GitHub!');
            onClose(); // Close modal after successful signup
        } catch (error) {
            setError(error.message);
            console.error('GitHub sign-up error:', error);
        }
    };
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
                    <button onClick={handleSignup}>Make new Account</button>
                </div>
                <hr />
                <h3>Or sign up with:</h3>
                <button onClick={handleGoogleSignup}>Google</button>
                <button onClick={handleGithubSignup}>GitHub</button>
            </div>
        </div>
    );
}

export default Signup;

