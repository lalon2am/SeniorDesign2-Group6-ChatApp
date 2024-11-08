import './Friends.css';
import React, { useEffect, useState } from 'react';
function Friends({ isOpen }) {

  const [friends, setFriends] = useState([]);
  const [friendresult, setfriendresult] = useState('');
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  function addFriend() {
    //do friend bs...
    try {
      const response = global.fetch(process.env.REACT_APP_API_URL + '/addfriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: inputValue, friendId: localStorage.getItem("userId")})
      },
      ).then(function (r) {
        if (r.ok) {
          //stuff

          r.text().then(function (result) {


            if (result == "Friend Added") {
              setfriendresult("Friend Added");
            } if (result == "You've already added that friend") {
              setfriendresult("You've already added that friend");
            } else if (result == "No friend found") {
              setfriendresult("No friend found");
            } else if (result == 'That is you') {
              setfriendresult("That is you");
            }
          })
        } else {
          setfriendresult("Connection Failed");
        }

      }).then(function (data) {
      })
    } catch (e) {
      setfriendresult("Connection Failed");
    };
  }


  const response = global.fetch(process.env.REACT_APP_API_URL + `/getfriends/${encodeURIComponent(localStorage.getItem(userid))}`, {
    method: 'GET',
  },
  ).then(function (r) {
    if(r.ok){
      setFriends(r.json.friends);
    }
  })
//todo

  if (!isOpen){
    return null;
  }
  return (
<div className="Friends sidebar">
  <header className="Friends-header">
    <div className="input-container">
      <span>Add friends:</span>
      <input
        className="my-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div> {/* Closing the input-container div here */}
    <p className='friendaddresult'>{friendresult}</p>
    <button onClick={addFriend}>Add</button>
  </header>
  <div className='friends-list'>
    
    <ul>
    {friends.map((item, index) => (
          <li key={index}>{item}</li> // Use index as key (or a unique id if available)
        ))}
    </ul>
  </div>
</div>
  );
}

export default Friends;
