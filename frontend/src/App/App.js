import './App.css';

import Chat from '../Chat/Chat'
import Send from '../Send/Send'
import Auth from '../Auth/Auth'
import Friends from '../Friends/Friends';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

function App() {
  function selectFriend(friend){
    
    setChatFriend(friend);
    setChatOpen(true);
  }
  const [isAuthOpen, setAuthOpen] = useState(true);
  const [isAppOpen, setAppOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatFriend, setChatFriend] = useState({});
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
if(isAuthOpen){
  return(
  <div className="App" data-testid="app-container">
  <header className="App-header">
  </header>
  <Auth isOpen={isAuthOpen} closeAuth={closeAuth} />
</div>
)

}
  return (
    <div className="App" data-testid="app-container">
      <header className="App-header">
      </header>
      <Friends isOpen={isAppOpen} selectFriend={selectFriend}/>
      
      <div className='mainscreen'>
      <Chat isOpen={isChatOpen} friend={chatFriend}/>
      <Send isOpen={isChatOpen} friend={chatFriend}/>

      </div>


    </div>
  );
}

export default App;