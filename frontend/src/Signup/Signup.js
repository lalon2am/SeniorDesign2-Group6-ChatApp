import './Signup.css';
import React, { useState } from 'react';

function Signup({ isOpen, onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentMessage, setMessage] = useState('');
    const handleSubmit = () => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        //check if duplicate name first
        if (!passwordRegex.test(password)) {
          setMessage("Use 8+ characters, include number and special character")
        } else {
          //passed checks, login with username and password
          alert(`Username: ${username}, Password: ${password}`);
          // Proceed with your form submission or other logic here
        }
      };
    
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose} className="close-button">Return to login menu</button>
                <h2>Enter new account details</h2>
                <p>Username:</p>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />

      <p>Password:</p>
      <input 
        type="text" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
        <h3>{currentMessage}</h3>
      <button onClick={handleSubmit}>Submit</button>
                
            </div>
        </div>
    );
};




export default Signup;
