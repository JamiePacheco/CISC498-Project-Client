import "./Css/Lobby.css"
import "./Css/PixelCorners.css"

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserSession } from "../Interfaces/UserSession";
import { useGameLobbyEvents } from "../Hooks/topics/useGameLobbyEvents";
import { LobbyUser } from "../Interfaces/LobbyUser";
import { useStompTopic } from "../Hooks/UseStompTopic";
import { LobbySession } from "../Interfaces/LobbySession";
import { GameLobbyEvent, MessageEvent } from "../Interfaces/socket/GameLobbyEvent";
import { connectToGameLobby } from "../service/LobbySessionService";
import { GameLobbyMessage } from "../Interfaces/socket/GameLobbyMessage";

import { User } from "./Types/User"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { joinLobby, resetConnection, sendMessage } from "../redux/slices/lobbySlice";
import { formatTimestampWithLocale } from "../utility/date";
import ChatBox from "./components/Chat";
import LobbySettings from "./components/LobbySettingOverlay";

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


type messages = {//Might not be needed anymore
    userID: number;
    message: string;
}

export default function GameLobbyPage() {

    // this is purely for debugging because strict mode keeps on rerendering the components
    const initalized = useRef(false);
    
    // this is to access location state variables
    const location = useLocation();

    const [maxPlayer, setMaxPlayers] = useState<number>(20) // Not letting change in lobby
    const [lobby, setLobby] = useState<LobbySession | null>(null)

    // this should be changed to be using state manager
    const [user, setUser] = useState<LobbyUser>(location.state.user)

    // const [userSession, setUserSession] = useState<UserSession | null>(null);

    // const {lobby} = location.state 
    const [playerList, updatePlayerList] = useState<UserSession[]>([])
    const playerCount = playerList.length
    const [chatLog, updateChat] = useState<IMessage[]>([]) // Should pair with user who sent it 
    const [input, setInput] = useState<string>("")// Helps with sending messages to chat

    //Auto scroll chat
    const messagesRef = useRef<HTMLDivElement | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    const dispatch = useDispatch();
    
    const gameLobbySession = useSelector((state : RootState) => state.lobby.lobbySession);
    const lobbyUsers = useSelector((state : RootState) => state.lobby.users);
    const userSession = useSelector((state : RootState) => state.lobby.userSession);
    const chat = useSelector((state : RootState) => state.lobby.chat);

    useEffect(() => {
        // only runs a single time per component lifecycle (fixes double render caused by strict mode)
        if (!initalized.current) {
            console.log(user)

            initalized.current = true;

            const newTempId = String(crypto.randomUUID());
            // connect to the game lobby in order to retrieve the current in-memory lobbySession object
            connectToGameLobby(location.state.lobby.lobbyCode, location.state.lobby.password, newTempId, user).then(res => {
                const connectedLobby = res.data.responseContent;
                console.log("Retrived lobby data from endpoint:")
                console.log("JWT " + document.cookie)
                console.log(connectedLobby)
                if (connectedLobby !== null) {
                    
                    // reset the socket connection to utilize the (potentially) newly stored 
                    // dispatch(
                    //     resetConnection()
                    // )
                    console.log("Reset Socket Connection")
                    // create a new user session
                    const newUserSession : UserSession = {
                        tempId: newTempId,
                        sessionId: "",
                        displayName: user.nickname,
                        lobbyId: 0,
                        lobbyCode: location.state.lobby.lobbyCode,
                        active: false,
                        isSpectator: false,
                        host: false
                    }
                    console.log(newUserSession)

                    dispatch(
                        joinLobby({
                            gameLobby : connectedLobby,
                            userSessionDetails : newUserSession
                        })
                    );
                }
            })
        }
    }, [dispatch, gameLobbySession, location.state.lobby, user])

    // function chatScroll(){
    //     bottomRef.current?.scrollIntoView({behavior: "smooth"})
    // }

    // function checkChatScroll():boolean{
    //     const chatbox = messagesRef.current;
    //     if(!chatbox)
    //         return false;
    //     const threshold = 100; //pixels from bottom of chatbox
    //     const position = chatbox.scrollTop + chatbox.clientHeight;
    //     const height = chatbox.scrollHeight;
    //     return position >= height - threshold;
    // }

    // useEffect(()=>{
    //     if(checkChatScroll())
    //         chatScroll();
    // }, [])

    console.log("Current State")
    console.log(gameLobbySession)
    console.log(userSession)
    console.log(lobbyUsers)
    console.log(chat)

    if (!gameLobbySession) {
        return <div> oops </div>
        
    }

    return (
        <div>
            <LobbySettings></LobbySettings>
            <div className="lobbyStatus">
                <div>Players: {lobbyUsers.length} / {gameLobbySession?.maxPlayers} </div>
                <div> Lobby ID: {gameLobbySession?.lobbyCode}</div>
                <Link to={"/aux-arena"} className="button" >Start</Link>
            </div>
            <div className="playerbox"            
            >
                {
                    lobbyUsers.map((user : UserSession, index) => {
                        
                    const color = user.active ? "white" : "darkgrey"

                    return (
                        <div 
                            key = {index} 
                            className="players"
                            style={{color: color}}    
                        >
                            {user.tempId === userSession?.tempId && <span>*</span>} <span> {user.displayName} </span> {user.host && <span> (host)</span>} 
                        </div>
                    )})
                } 
            </div>
            <ChatBox/>
        </div>
    )
}