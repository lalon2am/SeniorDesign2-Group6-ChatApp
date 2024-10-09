import './Chat.css';
import Message from '../Message/Message';

function Chat({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="Chat">
      <header className="Chat-header">
        <p>
          Edit <code>src/Chat.js</code> and save to reload.
        </p>
      </header>

      <Message />

    </div>
  );
}

export default Chat;
