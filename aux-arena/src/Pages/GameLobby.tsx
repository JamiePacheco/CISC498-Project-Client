import { useEffect, useRef, /*useMemo,*/ useState } from "react";
import "./Lobby.css"
import "./Css/PixelCorners.css"
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

    function debug(){
        updatePlayerList([...playerList, {userID: 1, sessionID: 1, displayName: "Username",
         lobbyID:lobby, lastPingTime:"9:38AM", active:true, isSpectator:false}])
    }

    useEffect(()=>{
        updatePlayers(player)
    }, [])//Sets the current player onto the list, edit the player info above to be accurate

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
        if(!chat.trim()) return; // ignore empty messages){
        let newChat = chatLog
        if(chatLog.length < 50)
            updateChat([...newChat, {message:chat, name:username}])
        if(chatLog.length >= 50)
            newChat.shift()
            updateChat([...newChat, {message:chat, name:username}])
        setInput("")
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
        newChat(input, user);
        }
    };

    //Auto scroll chat
    const messagesRef = useRef<HTMLDivElement | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)


    function chatScroll(){
        bottomRef.current?.scrollIntoView({behavior: "smooth"})
    }

    function checkChatScroll():boolean{
        const chatbox = messagesRef.current;
        if(!chatbox)
            return false;
        const threshold = 100; //pixels from bottom of chatbox
        const position = chatbox.scrollTop + chatbox.clientHeight;
        const height = chatbox.scrollHeight;
        return position >= height - threshold;
    }

    useEffect(()=>{
        if(checkChatScroll())
            chatScroll();
    }, [chatLog])


    return (
        <div>
            <div className="lobbyStatus">
                <div style={{paddingLeft: "1rem"}}>Players: {playerCount} / {maxPlayer} </div>
                <div>Lobby ID: {lobby}</div>
                <Link to={"/aux-arena"} className="button" state={user}>Start</Link>
            </div>
            <button className="button" onClick={debug}>Add Players</button>
            <div className="playerbox pixel-corner">
                {playerList.map((player, index)=>(
                    <div key={index} className="players">
                        {player.displayName} 
                    </div>
                ))}
            </div>
            <div className="chat-bar pixel-corners">
                <div className="chatbox " ref={messagesRef}>
                    <div>
                        {chatLog.map((chat, index)=>(
                            <div key={index} className="chat">
                                {chat.name} : {chat.message} 
                            </div>
                        ))}
                        <div ref={bottomRef}></div>
                    </div>
                </div>
                <input id="Chat" type="text" className="send-box" value={input} onKeyDown={handleKeyDown} onChange={updateInput}></input>
                <button className="send-button" onClick={()=>newChat(input, user)}>Send</button>
            </div>
        </div>
    )
}