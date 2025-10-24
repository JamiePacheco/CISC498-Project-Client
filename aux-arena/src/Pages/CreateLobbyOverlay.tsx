import '../App.css';
import './overlay.css'
import { Link } from "react-router-dom";

export interface userStatus{
    user: string;
    setUser: (name: string)=>void;
    loggedIn: string;
    setCreating: (isCreating:boolean)=>void;
    lobby: string;
    setLobby: (code:string)=>void;
    lobbyPrivate: boolean;
    setPrivate: (something:boolean)=>void;
}

export default function CreateLobby({user, setUser, loggedIn, setCreating, lobby, setLobby, lobbyPrivate, setPrivate}: userStatus){
    function changeName(event:any){
        setUser(event.target.value);
    }

    function lobbyHelper(){
        const lobbyCode = Math.floor(Math.random() * 9999)
        setLobby(lobbyCode.toString())
    }

    function privateHelper(){
        setPrivate(!lobbyPrivate)
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
                <label form="private" >Private Lobby?</label>
                <input type='checkbox' id='private' name='private' onClick={privateHelper}/>
            </div>
            
            {lobbyPrivate&& <div className='input'>
                Password 
                <input type='text' className='text-box' placeholder={"optional"}></input>
            </div>}
            <div className='input'>
                <Link to="/game-lobby" className="enter lobby-button">Create</Link>
            </div>
        </div>
    )
}