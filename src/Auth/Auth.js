import './Auth.css';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import Signup from '../Signup/Signup';
import { saveUserToFirestore } from '../firestoreService';

function Auth({ isOpen, closeAuth }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const auth = getAuth(); // Get the Firebase Auth instance

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert('All fields are required');
      return;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
  
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Sign up successful!');
      closeModal();
      // Optionally save user to Firestore
      await saveUserToFirestore({ name, email });
    } catch (error) {
      alert(`Sign-Up Error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Both email and password are required');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Store user information
      alert('Login successful!');
      closeAuth(); // Close the authentication modal
    } catch (error) {
      alert('Login failed, please try again');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user information
      alert('Logout successful!');
      // Redirect logic can be added here if needed
      // For example, if you're using React Router:
      // history.push('/auth'); // Adjust the path as needed
    } catch (error) {
      alert('Logout failed, please try again');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up subscription
  }, [auth]);

  if (!isOpen) return null;
  
  return (
    <div className="container">
      {/* Left Side: General Welcome Message */}
      <div className="left-side">
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Speech%20Balloon.png" alt="Speech Balloon" width="50" height="50" />
        <h1>ChatMessaging App</h1>
        <p>Connect easier with your friends, classmates, or collegues. Join conversations, and have fun while meeting new friends!</p>
      </div>
  
      {/* Right Side: Login Section */}
      <div className="right-side">
        <div className="Auth">
          {!isModalOpen && (
            <>
              <div className="Auth-box">
                <h2>Log In</h2>
                <p>Email:</p>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                />
                <p>Password:</p>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password" 
                />
                
                <button onClick={handleLogin}>Log In</button>
  
                <p>Don't have an account?</p>
                <button onClick={openModal}>Register</button>
              </div>
            </>
          )}
  
          {/* Signup Modal */}
          <Signup 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            handleSignUp={handleSignUp} 
            setName={setName}
          />
        </div>
      </div>
    </div>
  );
}
export default Auth;