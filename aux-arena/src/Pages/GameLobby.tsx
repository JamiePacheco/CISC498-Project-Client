import { useEffect, useState } from "react";
//import { io } from "socket.io-client";
import "./Lobby.css"
import { useLocation } from "react-router-dom";

//const socket = io("http://localhost:3000"); //Placeholder, change this to server ip

export interface information{
  user: string;
  loggedIn: string;
}

export default function GameLobby({user, loggedIn}: information) {
    const [playerList, updatePlayerList] = useState<string[]>([user, "user2", "user3", "user3"])
    const [playerCount, updateCount] = useState<number>(playerList.length)
    const [maxPlayer] = useState<number>(20) // Not letting change in lobby
    const location = useLocation()
    const {lobby} = location.state 


    /*useEffect(()=> {//Use to update playercount when new players join
        function updatePlayers(newPlayers:string){
            updatePlayerList([...playerList, ...newPlayers])
            updateCount(playerList.length)
        }

        socket.on("playerListUpdate", (data:any)=>{
            updatePlayers(data.players);
        })

        return ()=>{
            socket.off("playerListUpdate")
        };

    }, [playerList])*/

    return (
        <div>
            <div className="lobbyStatus">
                <div>Players: {playerCount} / {maxPlayer} </div>
                <div>Lobby ID: {lobby}</div>
                <div>{}</div>
            </div>
                
            <div className="playerbox">
                {playerList.map((player, index)=>(
                    <div key={index} className="players">
                        {player}
                    </div>
                ))}
            </div>
        </div>
    )
}