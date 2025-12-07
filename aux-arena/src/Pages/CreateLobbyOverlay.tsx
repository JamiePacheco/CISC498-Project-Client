import { useState } from 'react';
import '../App.css';
import './overlay.css'
import "./Css/PixelCorners.css"
import { Link } from "react-router-dom";

export interface userStatus{
    user: string;
    setUser: (name: string)=>void;
    loggedIn: string;
    setCreating: (isCreating:interaction)=>void;
}

type interaction = "Idle" | "Joining" | "Creating";

export default function CreateLobby({user, setUser, loggedIn, setCreating}: userStatus){
    const [lobby, setLobby] = useState<string>(
        (Math.floor(Math.random() * 9999)).toString().padStart(4, "000")
    );
    const [lobbyPrivate, setPrivate] = useState<boolean>(false);
    const [numPlayers, setNum] = useState<number>(3);
    const [password, setPassword] = useState<string>("");
    
    function changeName(event:any){
        setUser(event.target.value);
    }

    function privateHelper(){
        setPrivate(!lobbyPrivate)
        setPassword("")
    }

    function numberHelper(event:any){
        if(event.target.value < 3)
            setNum(3)
        else if(event.target.value > 20)
            setNum(20)
        else setNum(event.target.value)
    }

    function passwordHelper(event:any){
        setPassword(event.target.value)
    }

    type Packet = { // Packet to send to server
        name: string //Username
        maxPlayer:number
        lobbyPrivacy:boolean
        password?:string
    }

    function sendPacket(){
        const packet:Packet = {name:user, maxPlayer:numPlayers, lobbyPrivacy:lobbyPrivate, password:password}
    }

    return(
        <div className="overlay pixel-corner">
            <div className="exit" onClick={()=>setCreating("Idle")}>x</div>
            Create Lobby
            <div className="input">
                Username:
                <div>
                    <input disabled={loggedIn? true: false} className="text-box" placeholder={user} type="text" onChange={changeName}></input>
                </div>
            </div>

            <div className='input'>
                Max Players:
                <input type='text' disabled className='small-text-box' min={3} max={20} value={numPlayers} onChange={numberHelper}></input>
                <div>
                    <input type="range" min="3" max="20" className='text-box' value={numPlayers} onChange={numberHelper}></input>
                </div>
            </div>

            <div className='input'>
                <label form="private" >Private Lobby?</label>
                <input type='checkbox' id='private' name='private' onClick={privateHelper}/>
            </div>
            
            {lobbyPrivate&& <div className='input'>
                Password 
                <input type='text' className='text-box' placeholder={"optional"} onChange={passwordHelper}></input>
            </div>}
            <div className='input'>
                <Link to="/game-lobby" className="enter lobby-button" state={{lobby:lobby}}>Create</Link>
            </div>
        </div>
    )
}