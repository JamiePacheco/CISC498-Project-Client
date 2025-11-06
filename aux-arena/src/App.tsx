import { RxStomp } from '@stomp/rx-stomp';
import { RxStompConfig } from '@stomp/rx-stomp';
import React from 'react';
import logo from './logo.svg';
import './App.css';


const rxstomp = new RxStomp();
const rxStompConfig: RxStompConfig = {
  brokerURL: 'ws://localhost:3000/ws',
  connectHeaders: {
    username: 'guest',
    userID: 'num',
  },
  debug: (msg) => {
    console.log(new Date(), msg)
  },
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: 200,
}

function App() {

  rxstomp.configure(rxStompConfig)
  rxstomp.activate()
  rxstomp.deactivate()

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
