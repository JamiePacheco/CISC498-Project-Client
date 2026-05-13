import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useState } from "react";
import { setPrompt } from "../../redux/Store/gameSlices";
import { sendPrompt } from "../../redux/slices/lobbySlice";
import { Prompt } from "../../Interfaces/PromptPair";


interface inputs{
    isPlayer: boolean;
}

export default function PromptPhase({isPlayer}:inputs){
    const game = useSelector((state:RootState)=>state.game);
    const lobby = useSelector((state:RootState)=>state.lobby);
    const dispatch = useDispatch<AppDispatch>();
    const [input, setInput] = useState<string>("");
    const [submitted, setSubmitted] = useState(false);

    function updateInput(event:any){
        setInput(event.target.value)
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>){
        if (event.key === "Enter") {
            
            if (!lobby.lobbySession || !lobby.userSession) return;

            const prompt : Prompt = {
                "wasGenerated" : false,
                "authorId" : lobby.userSession?.tempId,
                "prompt" : input
            }

            dispatch(
                sendPrompt(
                    {
                        "gameLobby" : lobby.lobbySession,
                        "prompt" : prompt
                    }
                )
            )

            setSubmitted(true)
        }
    }
    return (
        <div>
            {isPlayer && <div>
                Type a prompt: <div className="prompt-sfx">{input}</div>
                <input type="text" placeholder="Press Enter to submit" onKeyDown={handleKeyDown} disabled={submitted}
                    value={input} onChange={updateInput} className="text-box">
                </input>
            </div>}
            {!isPlayer && <div>
                waiting for players to write their prompts
            </div>}
        </div>
    )
}