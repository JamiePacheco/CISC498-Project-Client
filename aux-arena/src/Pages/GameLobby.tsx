import { useEffect, useMemo, useRef, useState } from "react";
import "./Lobby.css"
import { Link, useLocation } from "react-router-dom";
import { UserSession } from "../Interfaces/UserSession";
import { useGameLobbyEvents } from "../Hooks/topics/useGameLobbyEvents";
import { sendMessage } from "../sockets/SocketMessageService";
import { LobbyUser } from "../Interfaces/LobbyUser";
import { useStompTopic } from "../Hooks/UseStompTopic";
import { Message } from "../Interfaces/socket/Message";
import { LobbySession } from "../Interfaces/LobbySession";
import { GameLobbyEvent, MessageEvent } from "../Interfaces/socket/GameLobbyEvent";
import { connectToGameLobby } from "../service/LobbySessionService";

export interface information{
  user: string;
  loggedIn: string;
}

export interface GameLobbyPageState {
    id : number,
    lobbyCode : string,
    password : string,
}

export interface IMessage {
    message : string,
    name : string;
}

export default function GameLobbyPage({loggedIn}: information) {

    // this is purely for debugging because strict mode keeps on rerendering the components
    const initalized = useRef(false);
    
    // this is to access location state variables
    const location = useLocation();

    const [maxPlayer, setMaxPlayers] = useState<number>(20) // Not letting change in lobby
    const [lobby, setLobby] = useState<LobbySession | null>(null)

    // this should be changed to be using state manager
    const [user, setUser] = useState<LobbyUser>(location.state.user)

    const [userSession, setUserSession] = useState<UserSession | null>(null);

    // const {lobby} = location.state 
    const [playerList, updatePlayerList] = useState<UserSession[]>([])
    const playerCount = playerList.length
    const [chatLog, updateChat] = useState<IMessage[]>([]) // Should pair with user who sent it 
    const [input, setInput] = useState<string>("")// Helps with sending messages to chat

    useEffect(() => {
        // only runs a single time per component lifecycle (fixes double render caused by strict mode)
        if (!initalized.current) {
            console.log(user)

            initalized.current = true;

            const newTempId = String(crypto.randomUUID());

            // connect to the game lobby in order to retrieve the current in-memory lobbySession object
            connectToGameLobby(location.state.lobby.lobbyCode, location.state.lobby.password, newTempId, user).then(res => {
                const connectedLobby = res.data.responseContent;
                console.log(connectedLobby)
                if (connectedLobby !== null) {
                    setLobby(connectedLobby);

                    // create a new user session
                    const newUserSession : UserSession = {
                        tempId: newTempId,
                        sessionId: "",
                        displayName: user.nickname,
                        lobbyId: 0,
                        lobbyCode: location.state.lobby.lobbyCode,
                        lastPingTime: "",
                        active: false,
                        isSpectator: false,
                        host: false
                    }

                    // set the user session so the nickname and id is accessible
                    setUserSession(newUserSession)
                    // send a message to the lobby socket so other players know user has joined
                    sendMessage(`/app/game-lobby/join/${connectedLobby.id}`, newUserSession)

                    // set the inital player list to the entire set of active players
                    updatePlayerList(prev => {
                            const newPlayerList = [...prev, ...Object.values(connectedLobby.activeUsers).filter(u => u.active)]
                            console.log(newPlayerList)
                            return newPlayerList;
                        }
                    )

                    updateChat(prev => {
                        return [{
                            name : "System",
                            message : `Welcome to ${connectedLobby.name}`
                        },...prev]
                    })
                }
            })
        }
    }, [location.state.lobby, user])

    // subscribe to the socket endpoints
    useGameLobbyEvents<any>(`${location.state.lobby.id}`, (event) => {
        const message : GameLobbyEvent<any> = event;

        // should abstract the case logic to functions
        switch (message?.type) { 
            case MessageEvent.USER_JOINED:
                const joinedUser : UserSession = message.payload

                if (joinedUser.tempId !== userSession?.tempId) {
                    updatePlayerList(prev => [...prev, joinedUser])
                }                
                break;
            case MessageEvent.USER_LEFT:
                const disconnectedUser : UserSession = message.payload
                updatePlayerList(prev => {
                    return prev.filter((u) => u.tempId !== disconnectedUser.tempId)
                });
                break;
            case MessageEvent.NEW_HOST:
                const newHost : UserSession = message.payload
                updatePlayerList(prev => {
                    return prev.map(u => {
                        if (u.host && u.tempId !== newHost.tempId) u.host = false;
                        if (u.tempId === newHost.tempId) u.host = true;
                        return u;
                    })
                }
                )
                break;
            case MessageEvent.USER_CLEANUP:
                const removedUsers : UserSession[] = message.payload;
                console.log("removed users")
                console.log(removedUsers);
                updatePlayerList(prev => {
                    return prev.filter(u => !removedUsers.includes(u));
                })
                break; 
        }

        if (message?.message !== undefined){
            updateChat(prev => {
                return [...prev, 
                    {
                        name : "System",
                        message : message.message
                    }
                ]
            })
        }
    });


    useStompTopic<Message<any>>(`/user/queue/game-lobby/${location.state.lobby.id}`, (event) => {
            const userMessage : Message<any> = event;
            console.log(`processing message: ${JSON.stringify(userMessage)}`)
            switch(userMessage?.messageType) {
                case "USER_UPDATE":
                    // TODO add basic error handling
                    setUserSession(prevSession => {
                        const newUser : UserSession= userMessage.messageContent
                        console.log(newUser);
                        updatePlayerList(prev => {
                            const newPlayerList = [newUser, ...prev.filter(u => u.tempId !== newUser.tempId)];
                            console.log(`New Player List ${JSON.stringify(newPlayerList)}`)
                            return newPlayerList;
                        })
                        return newUser;
                    });

                    break;
            }
    });

    useStompTopic<Message<any>>(`/user/queue/errors`, (event) => {
        console.log(event);
    })

    // const gameLobbyEvents = useGameLobbyEvents(`${location.state.lobby.id}`); 
    // const userEvents : Message<any>[] = useStompTopic()
    // const errorEvents = useStompTopic(`/user/queue/errors`)

    // useEffect(() => {
    //     if (userEvents.length !== 0) {
    //         const userMessage : Message<any> = userEvents[userEvents.length - 1];
    //         // console.log(`processing message: ${JSON.stringify(userMessage)}`)
    //         switch(userMessage?.messageType) {
    //             case "USER_UPDATE":
    //                 // TODO add basic error handling
    //                 setUserSession(prevSession => {
    //                     const newUser : UserSession= userMessage.messageContent
    //                     console.log(newUser);
    //                     updatePlayerList(prev => {
    //                         const newPlayerList = [newUser, ...prev.filter(u => u.tempId !== newUser.tempId)];
    //                         console.log(`New Player List ${JSON.stringify(newPlayerList)}`)
    //                         return newPlayerList;
    //                     })
    //                     return newUser;
    //                 });

    //                 break;
    //         }
    //     }
    // }, [userEvents])


    // useEffect(() => {
    //     const message : GameLobbyEvent<any> = gameLobbyEvents[gameLobbyEvents.length-1];
    //     // console.log(`new message: ${message?.message} ${message?.type}`)

    //     // should abstract the case logic to functions
    //     switch (message?.type) { 
    //         case MessageEvent.USER_JOINED:
    //             const joinedUser : UserSession = message.payload

    //             if (joinedUser.tempId !== userSession?.tempId) {
    //                 updatePlayerList(prev => [...prev, joinedUser])
    //             }                
    //             break;
    //         case MessageEvent.USER_LEFT:
    //             const disconnectedUser : UserSession = message.payload
    //             updatePlayerList(prev => {
    //                 return prev.filter((u) => u.tempId !== disconnectedUser.tempId)
    //             });
    //             break;
    //         case MessageEvent.NEW_HOST:
    //             const newHost : UserSession = message.payload
    //             updatePlayerList(prev => {
    //                 return prev.map(u => {
    //                     if (u.host && u.tempId !== newHost.tempId) u.host = false;
    //                     if (u.tempId === newHost.tempId) u.host = true;
    //                     return u;
    //                 })
    //             }
    //             )
    //             break;
    //         case MessageEvent.USER_CLEANUP:
    //             const removedUsers : UserSession[] = message.payload;
    //             updatePlayerList(prev => {
    //                 return prev.filter(u => !removedUsers.includes(u));
    //             })
    //             break; 
    //     }

    //     if (message?.message !== undefined){
    //         updateChat(prev => {
    //             return [...prev, 
    //                 {
    //                     name : "System",
    //                     message : message.message
    //                 }
    //             ]
    //         })
    //     }

    // }, [gameLobbyEvents, userSession?.tempId])

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
        newChat(input, user.nickname);
        }
    };

    // console.log(gameLobbyEvents)
    // console.log(errorEvents)
    // console.log(userEvents)
    console.log(playerList)
    // console.log(userSession)

    return (
        <div>
            <div className="lobbyStatus">
                <div>Players: {playerCount} / {maxPlayer} </div>
                <div> Lobby ID: {lobby && lobby.lobbyCode}</div>
                <Link to={"/aux-arena"} className="button" >Start</Link>
            </div>
            {/* <button onClick={addPlayer} className="button">Debug</button> */}
            <div className="playerbox">
                {playerList.map((user : UserSession, index) => (
                    <div key = {index} className="players">
                       {user.tempId === userSession?.tempId && <span>*</span>}  {user.displayName} {user.host && <span> (host)</span>} {!user.active && <span>Disconnected</span>} 
                    </div>
                ))
                    

                /* {playerList.map((player, index)=>(
                    <div key={index} className="players">
                        {player.displayName} 
                    </div>
                ))} */

                } 
               
                

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
                <button className="send-button" onClick={()=>newChat(input, user.nickname)}>Send</button>
            </div>
        </div>
    )
}