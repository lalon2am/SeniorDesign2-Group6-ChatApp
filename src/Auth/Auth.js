import './Auth.css';
import Signup from '../Signup/Signup';
import Popup from "reactjs-popup";
import React, { useState } from 'react';
function Auth({ isOpen, closeAuth }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const login = () => {
    // login logic
    closeAuth();
  }

  if (!isOpen) return null;
  return (
    <div className="Auth">
      {!isModalOpen && (<>
        <div className="Auth-box">
          <h2>Enter your username and password</h2>
          <p>Username: </p><input type="text" />
          <p>Password: </p><input type="text" />

          <button onClick={login}>Log in</button>

          <p>Don't hava a account?</p>
          <button onClick={openModal}>Register</button>
        </div>
      </>)
      }

      <Signup isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Auth;
