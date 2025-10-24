import { useState } from "react";
import LobbyOverlay from "./JoinLobbyOverlay";
import CreateLobby from "./CreateLobbyOverlay";
import LoginOverlay from "./loginOverlay";
import "../App.css";
import "./Lobby.css"

export interface information{
  username: string;
  setUsername: (name:string)=>void;
  loggedIn: string;
  setLoggedIn: (isLoggedIn:string)=>void;
  lobby: string;
  setLobby: (code:string)=>void;
  handleLogOut: ()=>void;
  lobbyPrivate: boolean;
  setPrivate: (something:boolean)=>void;
}

export default function HomePage({username, setUsername, loggedIn, setLoggedIn, lobby, setLobby, handleLogOut, lobbyPrivate, setPrivate}: information) {
    const [joining, setJoining] = useState<boolean>(false) // To show lobby overlay after clicking "Join Lobby"
    const [creating, setCreating] = useState<boolean>(false) // To show overlay for creating lobby
    const [loggingIn, setLoggingIn] = useState<boolean>(false) // To show overlay for log in
    return (
     <div className='main'>
          <div className='Sidebar'>
            {!loggedIn && <button className="button login" onClick={()=>setLoggingIn(!loggingIn)}>Login/Register</button>}
            {loggingIn && <LoginOverlay setUsername={setUsername} setLoggedIn={setLoggedIn} setLoggingIn={setLoggingIn}/>}
            {loggedIn && <div className="lobbyText">Hi {username}</div>}
            {loggedIn && <button onClick={handleLogOut}>LogOut</button>}
         </div>
          <div className='main1'>
            {joining && <LobbyOverlay user={username} setUser={setUsername} loggedIn={loggedIn} setJoining={setJoining} lobby={lobby} setLobby={setLobby}/>}
            {creating && <CreateLobby user={username} setUser={setUsername} loggedIn={loggedIn} setCreating={setCreating} lobby={lobby} setLobby={setLobby} lobbyPrivate={lobbyPrivate} setPrivate={setPrivate}></CreateLobby>}
            <button className="button" onClick={()=>setCreating(!creating)}>Create Lobby</button>
            <div>
              <button className='join-button' onClick={()=>setJoining(!joining)}> Join Lobby</button>
            </div>
        </div>
    </div>
    );
}