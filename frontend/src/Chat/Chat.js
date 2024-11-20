import './Chat.css';
import Message from '../Message/Message';
import React, { useEffect, useState } from 'react';

function Chat({ isOpen , friend}) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);



function loadMessages(){
  const response = global.fetch(process.env.REACT_APP_API_URL + '/getMessages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(friend)
  },
  ).then(function (r) {
    if (r.ok) {
      //stuff

      return r.json()
    } else {

    }

  }).then(function (result) {
    setMessages(result);
  })
}

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (error) return (
    <div>
      <h2>Messages</h2>
      <div>
        <h3>Unable to load messages at this time.</h3>
      </div>
    </div>
  );

  if (messages.length == 0) return (
    <div>
      <h2>Messages</h2>
      <div>
        <h3>Loading...</h3>
      </div>
    </div>
  );

  return (<div>
    {JSON.stringify(friend)}
    <h2>Messages</h2>
    {messages}
    <div>
      {messages.map((message) => {
        const date = new Date(message.timestamp);
        const formattedTime = `${date.toLocaleDateString()}`;
        return (
          <Message
            key={message.id}
            text={message.text}
            user={message.user}
            timestamp={formattedTime}
          />

        );
      })}
    </div>
  </div>);

}

export default Chat;
