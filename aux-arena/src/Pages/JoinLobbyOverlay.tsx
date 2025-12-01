import { useState } from "react";
import "../App.css"
import './overlay.css'
import { Link, useNavigate } from "react-router-dom";
import { LobbyUserRole } from "../Interfaces/LobbyUser";
import { connectToGameLobby } from "../service/LobbySessionService";
import { GameLobbyPageState } from "./GameLobby";
import { getGameLobby } from "../service/GameLobbyService";
import { GameLobby } from "../Interfaces/GameLobby";

export interface userStatus{
    user: string;
    setUser: (name: string)=>void;
    loggedIn: string;
    setJoining: (isJoining:boolean)=>void;
}

export default function LobbyOverlay({user, setUser, loggedIn, setJoining}: userStatus) {
    const [lobby, setLobby] = useState<string>("");
    const [spectator, setSpectator] = useState<boolean>(false); // link this state with the spectator input field
    const nav = useNavigate()


    function changeName(event:any){
        setUser(event.target.value);
    }

    function lobbyHelper(event:any){
        setLobby(event.target.value)
    }

    const joinLobbyAction = () => {

        getGameLobby(lobby, "").then(res => {
            const gameLobby : GameLobby = res.data.responseContent; 
            const role : LobbyUserRole = "GUEST"
            
            if (gameLobby.id !== undefined && gameLobby.lobbyCode !== undefined) {
                const lobbyUser = {
                    nickname : user,
                    isSpectator : false,
                    role : role
                }
                                
                const lobbyState : GameLobbyPageState = {
                    id : gameLobby.id,
                    lobbyCode : gameLobby.lobbyCode,
                    password : ""
                }
            
                nav("/game-lobby", {state : {lobby : lobbyState, user : lobbyUser}})
            }
        })
        // getGameLobby(lobby, "").then((res) => {
        //     console.log(res);
        //     const gameLobby = res.data.responseContent;
        //         if (gameLobby && gameLobby.lobbyCode !== undefined) {
        //             const tempUser = {
        //                 gamelobby: gameLobby,
        //                 nickname: user,
        //                 isSpectator: false //TODO change depending on checkbox
        //             }
        //             nav("/game-lobby", {state : {lobby : gameLobby, user : tempUser}})
        //         }
        // }).catch(e => {
        //         console.log(e);
        //     }   
        // )
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
                Spectator Mode
                <input type="checkbox"></input>
            </div>

            <button onClick = {() => joinLobbyAction()}> Join Lobby </button>

            <div className="input">
                <Link to="/game-lobby" className="enter lobby-button" state={{lobby:lobby}}>Join</Link>
            </div>
        </div>
    )
}