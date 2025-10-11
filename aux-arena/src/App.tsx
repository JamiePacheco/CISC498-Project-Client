import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './Pages/HomePage'
import CreateLobby from './Pages/CreateLobby';
import logo from "./logo.svg"
import GameLobby from "./Pages/GameLobby";
import { useState } from "react";

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
          <a href="/" className="link">
            <img src={logo} className="App-logo" alt="logo"/>
          </a>
        </header>
        <Routes>
          <Route path='/' element={<Home username={username} setUsername={handleUser} loggedIn={loggedIn} setLoggedIn={handleLoggedIn} lobby={lobby} setLobby={setLobby} handleLogOut={handleLogout}/>}></Route>
          <Route path='/make-lobby' element={<CreateLobby/>}></Route>
          <Route path='/game-lobby' element={<GameLobby user={username} loggedIn={loggedIn}/>}/>
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
