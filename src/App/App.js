import logo from '../logo.svg';
import './App.css';
import Session from '../Session/Session'
import Chat from '../Chat/Chat'
import Send from '../Send/Send'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <body>
        <Session />
        <Chat />
        <Send />
      </body>
    </div>
  );
}

export default App;
