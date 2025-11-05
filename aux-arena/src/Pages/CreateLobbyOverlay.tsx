import { useState } from 'react';
import '../App.css';
import './overlay.css'
import { Link } from "react-router-dom";

export interface userStatus{
    user: string;
    setUser: (name: string)=>void;
    loggedIn: string;
    setCreating: (isCreating:boolean)=>void;
}

export default function CreateLobby({user, setUser, loggedIn, setCreating}: userStatus){
    const [lobby, setLobby] = useState<string>(
        (Math.floor(Math.random() * 9999)).toString()
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
        setNum(event.target.value)
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
        <div className="overlay">
            <div className="exit" onClick={()=>setCreating(false)}>x</div>
            Create Lobby
            <div className="input">
                Username:
                <div>
                    <input disabled={loggedIn? true: false} className="text-box" placeholder={user} type="text" onChange={changeName}></input>
                </div>
            </div>

            <div className='input'>
                Max Players:
                <input type='number' className='small-text-box' min={3} max={20} value={numPlayers} onChange={numberHelper}></input>
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