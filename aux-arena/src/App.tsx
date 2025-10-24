import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './Pages/HomePage'
import logo from "./logo.svg"
import GameLobby from "./Pages/GameLobby";
import { useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  })

  const handleUser = (name: string) => {
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

  const [lobby, setLobby] = useState<string>("")

  const [lobbyPrivate, setPrivate] = useState<boolean>(false)


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
          <Route path='/' element={<Home username={username} setUsername={handleUser} loggedIn={loggedIn} setLoggedIn={handleLoggedIn} lobby={lobby} setLobby={setLobby} handleLogOut={handleLogout} lobbyPrivate={lobbyPrivate} setPrivate={setPrivate}/>}></Route>
          <Route path='/game-lobby' element={<GameLobby user={username} loggedIn={loggedIn} lobbyPrivate={lobbyPrivate} setPrivate={setPrivate}/>}/>
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
