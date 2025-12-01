import { useState } from 'react';
import '../App.css';
import './overlay.css'
import { Link, useNavigate } from "react-router-dom";
import { createNewGameLobby } from '../service/GameLobbyService';
import { GameLobby } from '../Interfaces/GameLobby';
import { LobbyUserRole } from '../Interfaces/LobbyUser';
import { GameLobbyPageState } from './GameLobby';

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
    
    const nav = useNavigate()

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

    const createGameLobby = () => {

        const newGameLobby : GameLobby = {
            maxPlayers : numPlayers,
            privateStatus : lobbyPrivate,
            password : password,
            name : `${user}'s lobby`
        }

        /* 
            we need to account for two cases when creating a game lobby
            - a user HAS an account and a user DOES NOT HAVE an account
            - If they have an account we simply take that data and associate it with the new account
            - If they do not have an account we create the temp account and associate it with the game lobby
        
        */

        createNewGameLobby(newGameLobby).then(res => {
            console.log(res)
            const gameLobby = res.data.responseContent;
            if (gameLobby && gameLobby.lobbyCode !== undefined && gameLobby.password !== undefined && gameLobby.id !== undefined) {

                const role : LobbyUserRole = "GUEST"
                
                const lobbyUser = {
                    nickname : user,
                    isSpectator : false,
                    gameLobby : gameLobby,
                    role : role
                }
                
                const lobbyState : GameLobbyPageState = {
                    id : gameLobby.id,
                    lobbyCode : gameLobby.lobbyCode,
                    password : ""
                }
                nav("/game-lobby", {state : {lobby : lobbyState, user : lobbyUser}})


                   

                // createGuestUser(user, gameLobby.lobbyCode, true).then(res => {
                //     console.log(res);
                //     const user = res.data.responseContent;
                //     // console.log(user);
                //     nav("/game-lobby", {state : {lobby : gameLobby, user : user}})
                // }
                // )

            }
        })
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
            <button onClick={() => {createGameLobby()}}> Create Lobby </button>
        </div>
    )
}