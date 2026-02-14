import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './Pages/HomePage'
import logo from "./Images/logo.svg"
import GameLobby from "./Pages/GameLobby";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuxArena from "./Pages/AuxArena";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./Pages/Store/store";

function App() {

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <header className='Header' style={{display:"flex"}}>
          <Link to="/" className="link">
            <img src={logo} className="App-logo" alt="logo"/>
          </Link>
        </header>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/game-lobby' element={<GameLobby/>}/>
          <Route path="/aux-arena" element={<AuxArena/>}></Route>
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
