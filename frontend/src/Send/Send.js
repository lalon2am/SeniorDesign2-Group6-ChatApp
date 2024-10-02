import './Send.css';

function Send({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="Send">
      <header className="Send-header">
        <p>
          Edit <code>src/Send.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default Send;
