import { useEffect, useState } from "react";
import LobbyOverlay from "./components/JoinLobbyOverlay";
import CreateLobby from "./components/CreateLobbyOverlay";
import LoginOverlay from "./components/loginOverlay";
import "./Css/Lobby.css"
import "./Css/PixelCorners.css"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./Store/store";
import { logout } from "./Store/userSlices";
import { leaveLobby } from "./Store/lobbySlices";

type interaction = "Idle" | "Joining" | "Creating";

export default function HomePage() {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(()=>{
      dispatch(leaveLobby());
    })
    const [interaction, setInteraction] = useState<interaction>("Idle")
    const [loggingIn, setLoggingIn] = useState<boolean>(false) // To show overlay for log in
    return (
     <div className='main'>
          <div className='Sidebar'>
            {!user.loggedIn && <button className="button login" onClick={()=>setLoggingIn(!loggingIn)}>Login/Register</button>}
            {loggingIn && <LoginOverlay setLoggingIn={setLoggingIn}/>}
            {user.loggedIn && <div className="lobbyText">Hi {user.userInfo.displayName}</div>}
            {user.loggedIn && <button onClick={()=>{dispatch(logout()); setInteraction("Idle")}}>LogOut</button>}
         </div>
          <div className='main1'>
            {interaction==="Joining" && <LobbyOverlay setJoining={setInteraction}/>}
            {interaction==="Creating" && <CreateLobby setCreating={setInteraction}/>}
            {!user.loggedIn && <div style={{paddingBottom:"-20px"}}>Log in to Join or Create a lobby!</div>}
            <button disabled={!user.loggedIn?true : false} className="button" onClick={()=>setInteraction("Creating")}>Create Lobby</button>
            <div>
              <button disabled={!user.loggedIn?true : false} className='join-button' onClick={()=>setInteraction("Joining")}> Join Lobby</button>
            </div>
        </div>
    </div>
    );
}