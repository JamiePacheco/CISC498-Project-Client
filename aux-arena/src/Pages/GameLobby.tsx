import { useEffect, useMemo, useState } from "react";
import "./Lobby.css"
import { Link, useLocation } from "react-router-dom";

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

type messages = {
    message: string;
    name: string;
}

export default function GameLobby({user, loggedIn}: information) {
    const [maxPlayer] = useState<number>(20) // Not letting change in lobby
    const location = useLocation()
    const {lobby} = location.state 
    const [playerList, updatePlayerList] = useState<UserSession[]>([])
    const playerCount = playerList.length
    const [chatLog, updateChat] = useState<messages[]>([{message:"Hello!", name:"System"}, {message:"Testing", name:"System"}]) // Should pair with user who sent it 
    const [input, setInput] = useState<string>("")// Helps with sending messages to chat

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
    }, [])//FOR TESTING PURPOSES, REMOVE LATER

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

    function updateInput(event:any){
        setInput(event.target.value)
    }

    function newChat(chat:string, username:string){
        if(input){
            updateChat([...chatLog, {message:chat, name:username}])
            if(chatLog.length > 50)
                updateChat(chatLog.splice(1))
            setInput("")
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
        newChat(input, user);
        }
    };


    return (
        <div>
            <div className="lobbyStatus">
                <div>Players: {playerCount} / {maxPlayer} </div>
                <div>Lobby ID: {lobby}</div>
                <Link to={"/aux-arena"} className="button" >Start</Link>
            </div>
            <button onClick={addPlayer} className="button">Debug</button>
            <div className="playerbox">
                {playerList.map((player, index)=>(
                    <div key={index} className="players">
                        {player.displayName} 
                    </div>
                ))}
            </div>
            <div className="chatbox">
                <div style={{paddingTop:"1em"}}>
                    {chatLog.map((chat, index)=>(
                        <div key={index} className="chat">
                            {chat.name} : {chat.message} 
                        </div>
                    ))}
                </div>

                <input type="text" className="send-box" value={input} onKeyDown={handleKeyDown} onChange={updateInput}></input>
                <button className="send-button" onClick={()=>newChat(input, user)}>Send</button>
            </div>
        </div>
    )
}