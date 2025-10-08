import { useState } from "react";
import LobbyOverlay from "./JoinLobbyOverlay";
import "../App.css";

export default function HomePage() {
    const [user, setUser] = useState<string>("")
    const [joining, setJoining] = useState<boolean>(false) // To show lobby overlay after clicking "Join Lobby"
    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    return (
     <div className='main'>
          <div className='Sidebar'>
            Sidebar
         </div>
          <div className='main1'>
            {joining && <LobbyOverlay username={user} setUser={setUser} loggedIn={loggedIn} setJoining={setJoining}/>}
            <a href="/make-lobby" className="button">Create Lobby</a>
            <div>
              <button className='join-button' onClick={()=>setJoining(!joining)}> Join Lobby</button>
            </div>
        </div>
    </div>
    );
}