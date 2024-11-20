import './Friends.css';
import React, { useEffect, useState } from 'react';
function Friends({ isOpen, selectFriend }) {


  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get userId from localStorage when the component mounts
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId || ''); // Set to empty string if userId is null
  }, []);

  const [friends, setFriends] = useState([]);
  const [friendresult, setfriendresult] = useState('');
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };



  function loadFriendList(){

    var myFriends= global.fetch(process.env.REACT_APP_API_URL + "/getFriends?userId="+localStorage.getItem("userId"), {
      method: 'GET',
    }).then(function(r){
      if(r.ok){
        return r.json().catch(e => {
          setFriends([]);
        });
      }else{
        alert("connection failure")
      }
    }).then(function(data){
      if(data){
      setFriends(data);
      }

    })
  }

  useEffect(() => {
    try{
    loadFriendList();
    }catch(e){
      
    }
    const intervalId = setInterval(() => {
      loadFriendList();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);


  function addFriend() {
    //do friend bs...
    try {
      const response = global.fetch(process.env.REACT_APP_API_URL + '/addFriend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId:localStorage.getItem("userId"),friendEmail:inputValue, friendId:""})
      },
      ).then(function (r) {
        if (r.ok) {
          //stuff

          return r.json()
        } else {
          setfriendresult("Connection Failed");
        }

      }).then(function (result) {
        //add alert of friend? you will see them pop up anyways so maybe unnecessary
      })
    } catch (e) {
      setfriendresult("Connection Failed");
    };
  }
  if (!isOpen){
    return null;
  }
  return (
<div className="Friends sidebar">
  <header className="Friends-header">
    <p className='friendid'>Your email is {localStorage.getItem("email")})</p>
    <div className="input-container">
      <span>Add friends:</span>
      <input
        className="my-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div> 
    <p className='friendaddresult'>{friendresult}</p>
    <button onClick={addFriend}>Add</button>
  </header>
  <br></br>
  <div className='friends-list'>
    
    <ul>
    {friends.map((item, index) => (
          <li onClick={() => selectFriend(item)} className="friendSelect" key={index}>{item.friendId}</li>
        ))}
    </ul>
  </div>
</div>
  );
}

export default Friends;
