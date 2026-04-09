import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useRef, useState } from "react";
import { newMessage } from "../../redux/Store/lobbySlices";

export default function ChatBox(){

    const user = useSelector((state:RootState)=> state.user);
    const lobby = useSelector((state:RootState) => state.lobby);
    const dispatch = useDispatch<AppDispatch>();
    const [input, setInput] = useState<string>("")// Helps with sending messages to chat

    function sendMessage(){
        dispatch(newMessage({message: input, userID: user.userInfo.userID}));
        setInput("");
    }

    function updateInput(event:any){
        setInput(event.target.value)
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
    }, [lobby.chat])

    return (
        <div className="chat-bar pixel-corners">
                <div className="chatbox " ref={messagesRef}>
                    <div>
                        {lobby.chat[0] && lobby.chat.map((chat)=>{
                            if(!chat) return <></>;
                            //if(chat.userID === -1) return <div className="chat">{"System"} : {chat.message}</div>
                            return <div className="chat">
                                {chat.author} : {chat.textMessage} 
                            </div>
                        })}
                        <div ref={bottomRef}></div>
                    </div>
                </div>
                <input id="Chat" type="text" className="send-box" value={input} onKeyDown={handleKeyDown} onChange={updateInput}></input>
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
    )
}