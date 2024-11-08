import './Auth.css';
import { useState, useEffect } from 'react';
import Signup from '../Signup/Signup';
function Auth({ isOpen, closeAuth }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      const response = global.fetch(process.env.REACT_APP_API_URL + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email:email, password:password, username:name })
      },
      ).then(function (r) {
        if(r.ok){
          localStorage.setItem('userId', r.json.userId);
      alert('Sign up successful!');
      closeModal();
        }else{
          alert('Sign up unsuccessful! nothing was returned');

        }
      })


      
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

const response = global.fetch(process.env.REACT_APP_API_URL + '/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email:email, password:password })
}
).then(function (r) {
  if(r.ok){
    localStorage.setItem('userId', r.json.userId);
alert('Sign in successful!');
closeModal();
  }else{
    alert('Sign up unsuccessful! nothing was returned');
    alert('Login successful!');
    closeAuth(); // Close the authentication modal
  }
})

      
    } catch (error) {
      alert('Login failed, please try again');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('userId');
      alert('Logout successful!');
    } catch (error) {
      alert('Logout failed, please try again');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="container acontainer">
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

                <button className='authButton' onClick={handleLogin}>Log In</button>

                <p>Don't have an account?</p>
                <button className='authButton' onClick={openModal}>Register</button>
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