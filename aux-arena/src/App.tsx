import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './Pages/HomePage'
import logo from "./Images/logo.svg"
import GameLobby from "./Pages/GameLobby";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RxStomp, RxStompConfig } from "@stomp/rx-stomp";
import SockJS from 'sockjs-client'

function App() {
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  })

  const handleUser = (name: string) => { //Change to store user data when accounts are made
    setUsername(name);
    localStorage.setItem("username", name);
};

  const [loggedIn, setLoggedIn] = useState<string>(() => {
    return localStorage.getItem("loggedIn") || ""; //Empty string for false, anything else for true
  })

  const handleLoggedIn = (truthy: string) => {
    setLoggedIn(truthy);
    localStorage.setItem("loggedIn", truthy);
};

  const lobbyConnectConfig: RxStompConfig = {
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    debug: (msg) => {
    console.log(msg);
  },
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 200,
  }

  const lobbyConnect = new RxStomp();
  lobbyConnect.configure(lobbyConnectConfig);
  lobbyConnect.activate();


  lobbyConnect.watch('/topic/game-lobby').subscribe(msg => {
      console.log(msg.body);
  });

  lobbyConnect.publish(
    {
      destination: '/topic/game-lobby',
      body: 'User has connected!'
    });

    
    lobbyConnect.deactivate();






  const handleLogout = () => {
    localStorage.clear();
    setUsername(""); 
    setLoggedIn(""); 
};

  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <header className='Header'>
          <Link to="/" className="link">
            <img src={logo} className="App-logo" alt="logo"/>
          </Link>
        </header>
        <Routes>
          <Route path='/' element={<Home username={username} setUsername={handleUser} loggedIn={loggedIn} setLoggedIn={handleLoggedIn}handleLogOut={handleLogout}/>}></Route>
          <Route path='/game-lobby' element={<GameLobby user={username} loggedIn={loggedIn} />}/>
          <Route path="/aux-arena"></Route>
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
