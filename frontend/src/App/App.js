import './App.css';
import Session from '../Session/Session'
import Chat from '../Chat/Chat'
import Send from '../Send/Send'
import Auth from '../Auth/Auth'
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

function App() {
  const [isAuthOpen, setAuthOpen] = useState(true);
  const [isAppOpen, setAppOpen] = useState(false);

  // Get the saved login status 
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, show the app
        setAuthOpen(true);
        setAppOpen(false);
      } else {
        // No user is signed in, show the Auth screen
        setAuthOpen(true);
        setAppOpen(false);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  const closeAuth = () => {
    console.log("close auth called");
    // The login logic would normally set the user in Firebase instead of localStorage
    setAuthOpen(false);
    setAppOpen(true);
  };

  return (
    <div className="App" data-testid="app-container">
      <header className="App-header">
      </header>

      <Auth isOpen={isAuthOpen} closeAuth={closeAuth} />
      <Session isOpen={isAppOpen} />
      <div className="textbox">
        <Chat isOpen={isAppOpen} />
        <Send isOpen={isAppOpen} />
      </div>
    </div>
  );
}

export default App;