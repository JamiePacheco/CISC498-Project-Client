import { useState } from "react";
import LobbyOverlay from "./JoinLobbyOverlay";
import "../App.css";
import "./Lobby.css"
import { Link } from "react-router-dom";

export interface information{
  username: string;
  setUsername: (name:string)=>void;
  loggedIn: string;
  setLoggedIn: (isLoggedIn:string)=>void;
  lobby: string;
  setLobby: (code:string)=>void;
  handleLogOut: ()=>void;
}

export default function HomePage({username, setUsername, loggedIn, setLoggedIn, lobby, setLobby, handleLogOut}: information) {
    const [joining, setJoining] = useState<boolean>(false) // To show lobby overlay after clicking "Join Lobby"

    return (
     <div className='main'>
          <div className='Sidebar'>
            <div className="lobbyText">Hi {username}</div>
            <button onClick={handleLogOut}>LogOut</button>
         </div>
          <div className='main1'>
            {joining && <LobbyOverlay user={username} setUser={setUsername} loggedIn={loggedIn} setJoining={setJoining} lobby={lobby} setLobby={setLobby}/>}
            <Link to="/make-lobby" className="button">Create Lobby</Link>
            <div>
              <button className='join-button' onClick={()=>setJoining(!joining)}> Join Lobby</button>
            </div>
        </div>
    </div>
    );
}