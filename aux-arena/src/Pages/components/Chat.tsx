import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useRef, useState } from "react";
import { GameLobbyMessage } from "../../Interfaces/socket/GameLobbyMessage";
import { sendMessage } from "../../redux/slices/lobbySlice";
import { formatTimestampWithLocale } from "../../utility/date";

export default function ChatBox(){

    const user = useSelector((state:RootState)=> state.user);
    const lobby = useSelector((state:RootState) => state.lobby);
    const dispatch = useDispatch();
    const [input, setInput] = useState<string>("")// Helps with sending messages to chat

    function sendChatMessage(){



        if (lobby.userSession === undefined || lobby.lobbySession == null) return;

        const newMessageContent : GameLobbyMessage = {
            textMessage: input,
            author: lobby.userSession?.displayName
        }

        console.log("sending message")

        dispatch(
            sendMessage(
                {
                    lobbyId : lobby.lobbySession.id, 
                    gameLobbyMessage : newMessageContent
                }
            )
        );

        
        setInput("");
    }


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
        sendChatMessage();
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
    }, [lobby.chat])

    return (
        <div className="chat-bar pixel-corners">
                <div className="chatbox " ref={messagesRef}>
                    <div>
                        {lobby.chat[0] && lobby.chat.map((chat : GameLobbyMessage)=>{
                            if(!chat || !chat.timestamp) return <></>;
                            return <div className="chat">
                                [{formatTimestampWithLocale(chat.timestamp)}] {chat.author} : {chat.textMessage} 
                            </div>
                        })}
                        <div ref={bottomRef}></div>
                    </div>
                </div>
                <input id="Chat" type="text" className="send-box" value={input} onKeyDown={handleKeyDown} onChange={(e) => {
                    setInput(e.target.value)
                    console.log(input)
                }}
                ></input>
                <button className="send-button" onClick={sendChatMessage}>Send</button>
            </div>
    )
}