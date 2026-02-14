import { useEffect, useRef, /*useMemo,*/ useState } from "react";
import "./Lobby.css"
import "./Css/PixelCorners.css"
import { Link } from "react-router-dom";
import { User } from "./Types/User"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./Store/store";
import { addUser, newMessage, removeUser } from "./Store/lobbySlices";


type messages = {//Might not be needed anymore
    userID: number;
    message: string;
}

export default function GameLobby() {
    const user = useSelector((state:RootState) => state.user);
    const lobby = useSelector((state:RootState) => state.lobby);
    const dispatch = useDispatch<AppDispatch>();
    const [input, setInput] = useState<string>("")// Helps with sending messages to chat
    
    useEffect(()=>{
        if (!lobby.userList[0]) {
            dispatch(addUser(user.userInfo));
        }
    }, [])

    const player:User = {userID: 2, displayName: "Testing", isReady: false, isSpectator: false, score: 0};

    function updatePlayers(newPlayer:User){
        if(lobby.numPlayer < lobby.playerCap)
            dispatch(addUser(newPlayer));
        else
            alert("Max players exceeded")
    }

    

    function debugAdd(){
        updatePlayers(player);
        if(lobby.usersByID[player.userID]){
            alert("A user with this userID is already in this lobby")
        }
    }

    function debugRemove(){
        dispatch(removeUser(player));
    }

    function updateInput(event:any){
        setInput(event.target.value)
    }

    function sendMessage(){
        dispatch(newMessage({message: input, userID: user.userInfo.userID}));
        setInput("");
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
        sendMessage();
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
    }, [lobby.chatLog])


    return (
        <div>
            <div className="lobbyStatus">
                <div style={{paddingLeft: "1rem", height:"2.5rem"}}>Players: {lobby.numPlayer} / {lobby.playerCap} </div>
                <div>Lobby ID: {lobby.lobbyID}</div>
                {lobby.numPlayer > 1 && <Link to={"/aux-arena"} className="button">Start</Link>}
            </div>
            <button className="button" onClick={debugAdd}>Add Player</button>
            <button className="button" onClick={debugRemove}>Remove Player</button>
            <div className="playerbox pixel-corner">
                {lobby.userList.map((player)=>{
                    if(!player.displayName) return null;
                    return <div className="players">
                        {player.displayName}
                    </div>
                })}
            </div>
            <div className="chat-bar pixel-corners">
                <div className="chatbox " ref={messagesRef}>
                    <div>
                        {lobby.chatLog[0] && lobby.chatLog.map((chat)=>{
                            if(!chat) return;
                            if(chat.userID === -1) return <div>{"System"} : {chat.message}</div>
                            return <div className="chat">
                                {lobby.usersByID[chat.userID].displayName} : {chat.message} 
                            </div>
                        })}
                        <div ref={bottomRef}></div>
                    </div>
                </div>
                <input id="Chat" type="text" className="send-box" value={input} onKeyDown={handleKeyDown} onChange={updateInput}></input>
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}