import './Signup.css';
import React, {useState} from 'react';
// src/Modal.js



function Signup ({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose} className="close-button">Return to login menu</button>
                {children}
            </div>
        </div>
    );
};




export default Signup;
