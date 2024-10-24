import './Chat.css';
import Message from '../Message/Message';

function Chat({ isOpen }) {
  if (!isOpen) return null;
  const messages = [
    { id: 1, sender: 'Alice', text: 'Hello, how are you?', timestamp: new Date('2024-01-01T14:30:00.000Z').getTime() + Math.floor(Math.random() * 86400000) },
    { id: 2, sender: 'Bob', text: 'I am good, thanks! How about you?', timestamp: new Date('2024-01-01T14:30:00.000Z').getTime() + Math.floor(Math.random() * 86400000) },
    { id: 3, sender: 'Alice', text: 'I am doing well, thank you!', timestamp: new Date('2024-01-01T14:30:00.000Z').getTime() + Math.floor(Math.random() * 86400000) },
    { id: 4, sender: 'Charlie', text: 'Hey everyone!', timestamp: new Date('2024-01-01T14:30:00.000Z').getTime() + Math.floor(Math.random() * 86400000) },
  ];

  return (
    <div>
      <h2>Messages</h2>
      <div>
        {messages.map((message) => {
          const date = new Date(message.timestamp);
          const formattedTime = `${date.toLocaleDateString()}`;
          return (
            <Message
              key={message.id}
              text={message.text}
              user={message.sender}
              timestamp={formattedTime}
            />

          );
        })}
      </div>
    </div>
  );
}

export default Chat;
