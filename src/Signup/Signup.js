import './Signup.css';
import React, { useState } from 'react';

function Signup({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose} className="close-button">Return to login menu</button>
                <h2>Enter new account details</h2>
                <p>Username: </p><input type="text" />
                <p>Password: </p><input type="text" />
                <button>Make new Account</button>
            </div>
        </div>
    );
};




export default Signup;
