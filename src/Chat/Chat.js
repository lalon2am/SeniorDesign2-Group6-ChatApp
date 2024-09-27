import './Chat.css';
import Message from '../Message/Message';

function Chat() {
  return (
    <div className="Chat">
      <header className="Chat-header">
        <p>
          Edit <code>src/Chat.js</code> and save to reload.
        </p>
      </header>
      <body>
        <Message />
      </body>
    </div>
  );
}

export default Chat;
