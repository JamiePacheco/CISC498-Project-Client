import { useState } from "react";
import "../App.css"
import './overlay.css'
import "./Css/PixelCorners.css"
import { Link, useNavigate } from "react-router-dom";
import { LobbyUserRole } from "../Interfaces/LobbyUser";
import { connectToGameLobby } from "../service/LobbySessionService";
import { GameLobbyPageState } from "./GameLobby";
import { getGameLobby } from "../service/GameLobbyService";
import { GameLobby } from "../Interfaces/GameLobby";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import { link } from "node:fs";

export interface userStatus{
    setJoining: (isJoining:interaction)=>void;
}

type interaction = "Idle" | "Joining" | "Creating";
    const [spectator, setSpectator] = useState<boolean>(false); // link this state with the spectator input field
    const nav = useNavigate()


export default function LobbyOverlay({setJoining}: userStatus) {
    const user = useSelector((state:RootState)=> state.user);

    function lobbyHelper(event:any){
        // Update Global State
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

            <button onClick = {() => joinLobbyAction()}> Join Lobby </button>

            <div className="input">
                <Link to="/game-lobby" className="enter lobby-button">Join</Link>
            </div>
        </div>
    )
}