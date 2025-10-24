import "../App.css"
import './overlay.css'
import { Link } from "react-router-dom";

export interface userStatus{
    user: string;
    setUser: (name: string)=>void;
    loggedIn: string;
    setJoining: (isJoining:boolean)=>void;
    lobby: string;
    setLobby: (code:string)=>void;
}

export default function LobbyOverlay({user, setUser, loggedIn, setJoining, lobby, setLobby}: userStatus) {

    function changeName(event:any){
        setUser(event.target.value);
    }

    function lobbyHelper(event:any){
        setLobby(event.target.value)
    }

    return(
        <div className="overlay">
            <div className="exit" onClick={()=>setJoining(false)}>x</div>
            Join Lobby
            <div className="input">
                Username:
                <div>
                    <input disabled={loggedIn? true: false} className="text-box" placeholder={user} type="text" onChange={changeName}></input>
                </div>
            </div>
            <div className="input">
                Lobby Code:
                <div>
                    <input className="text-box" type="text" onChange={lobbyHelper}></input>
                </div>
            </div>

            <div className="input">
                <Link to="/game-lobby" className="enter lobby-button">Test</Link>
            </div>
        </div>
    )
}