import './Chat.css';
import Message from '../Message/Message';

function Chat({ isOpen }) {
  if (!isOpen) return null;
  const messages = [
    { id: 1, sender: 'Alice', text: 'Hello, how are you?' },
    { id: 2, sender: 'Bob', text: 'I am good, thanks! How about you?' },
    { id: 3, sender: 'Alice', text: 'I am doing well, thank you!' },
    { id: 4, sender: 'Charlie', text: 'Hey everyone!' },
];

  return (
    <div>
        <h2>Messages</h2>
        <div>
            {messages.map((message) => (
                <div key={message.id}>
                    <strong>{message.sender}:</strong> {message.text}
                </div>
            ))}
        </div>
    </div>
);
}

export default Chat;
