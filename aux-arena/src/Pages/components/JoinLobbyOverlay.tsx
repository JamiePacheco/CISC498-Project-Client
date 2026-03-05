import "../../App.css"
import '../Css/overlay.css'
import "../Css/PixelCorners.css"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";

export interface userStatus{
    setJoining: (isJoining:interaction)=>void;
}

type interaction = "Idle" | "Joining" | "Creating";

export default function LobbyOverlay({setJoining}: userStatus) {
    const user = useSelector((state:RootState)=> state.user);

    function lobbyHelper(event:any){
        
    }

    return(
        <div className="overlay pixel-corner">
            <div className="exit" onClick={()=>setJoining("Idle")}>x</div>
            Join Lobby
            <div className="input">
                Username:
                <div>
                    <input disabled className="text-box" placeholder={user.userInfo.displayName} type="text"></input>
                </div>
            </div>
            <div className="input">
                Lobby Code:
                <div>
                    <input className="text-box" type="text" onChange={lobbyHelper}></input>
                </div>
            </div>
            <div className="input">
                Spectator Mode
                <input type="checkbox"></input>
            </div>
            <div className="input">
                <Link to="/game-lobby" className="enter lobby-button">Join</Link>
            </div>
        </div>
    )
}