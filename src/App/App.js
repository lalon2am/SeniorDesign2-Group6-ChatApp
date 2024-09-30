import './App.css';
import Session from '../Session/Session'
import Chat from '../Chat/Chat'
import Send from '../Send/Send'
import Auth from '../Auth/Auth'
import React, { useState, useEffect } from 'react';

function App() {
  const [isAuthOpen, setAuthOpen] = useState(true);
  const [isAppOpen, setAppOpen] = useState(false);

  // Get the saved login status 
  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser !== null && JSON.parse(savedUser) !== null) {
      setAuthOpen(false);
      setAppOpen(true);
    } else {
      setAuthOpen(true);
      setAppOpen(false);
    }
  }, []);

  const closeAuth = () => {
    console.log("close auth called");
    localStorage.setItem('user', JSON.stringify({ username: "test", password: "test" }));
    setAuthOpen(false);
    setAppOpen(true);
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>

      <Auth isOpen={isAuthOpen} closeAuth={closeAuth} />
      <Session isOpen={isAppOpen} />
      <Chat isOpen={isAppOpen} />
      <Send isOpen={isAppOpen} />

    </div>
  );
}

export default App;
