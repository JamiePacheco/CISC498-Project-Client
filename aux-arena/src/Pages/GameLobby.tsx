import { useEffect, useMemo, useState } from "react";
import "./Lobby.css"
import { useLocation } from "react-router-dom";

export interface information{
  user: string;
  loggedIn: string;
}

type UserSession = {
    userID: number;
    sessionID: number;
    displayName: string;
    lobbyID: number;
    lastPingTime: string; //Java type instant, *should* be sent as an iso string
    active: boolean;
    isSpectator: boolean;
}

export default function GameLobby({user, loggedIn}: information) {
    const [maxPlayer] = useState<number>(20) // Not letting change in lobby
    const location = useLocation()
    const {lobby} = location.state 
    const [playerList, updatePlayerList] = useState<UserSession[]>([])
    const playerCount = playerList.length

    const player:UserSession = {userID: 1, sessionID: 1, displayName: user,
         lobbyID:lobby, lastPingTime:"9:38AM", active:true, isSpectator:false}

    function updatePlayers(newPlayer:UserSession){
        if(playerCount < 20)
            updatePlayerList([...playerList, newPlayer])
        else
            alert("Max players exceeded")
    }
    useEffect(()=>{
        updatePlayers(player)
    }, [])

    function addPlayer(){ //For testing 
        const newPlayer:UserSession = {userID: 1, sessionID: 1, displayName: "newUser",
         lobbyID:lobby, lastPingTime:"9:38AM", active:true, isSpectator:false}
         updatePlayers(newPlayer)
    }

    /*useEffect(()=> {//Use to update playercount when new players join
        function updatePlayers(newPlayer:string){
            updatePlayerList([...playerList, newPlayer])
            updateCount(playerList.length)
        }

        socket.on("Update", (data:any)=>{
            if(data.type == MessageEvent.USERJOINED){
                updatePlayers(data.payload);
            }   
        })

        return ()=>{
            socket.off("updates")
        };

    }, [playerList])*/

    return (
        <div>
            <div className="lobbyStatus">
                <div>Players: {playerCount} / {maxPlayer} </div>
                <div>Lobby ID: {lobby}</div>
                <div>{}</div>
            </div>

            <button onClick={addPlayer} className="button">Debug</button>
                
            <div className="playerbox">
                {playerList.map((player, index)=>(
                    <div key={index} className="players">
                        {player.displayName} 
                    </div>
                ))}
            </div>
        </div>
    )
}