import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useState } from "react";
import { setPrompt } from "../../redux/Store/gameSlices";


interface inputs{
    isPlayer: boolean;
}

export default function PromptPhase({isPlayer}:inputs){
    const game = useSelector((state:RootState)=>state.game);
    const dispatch = useDispatch<AppDispatch>();
    const [input, setInput] = useState<string>("");

    function updateInput(event:any){
        setInput(event.target.value)
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>){
        if (event.key === "Enter") {
            dispatch(setPrompt(input))// CHANGE THIS TO SENDING PROMPT TO SERVER
            setInput("")
        }
    }
    return (
        <div>
            {isPlayer && <div>
                Type a prompt: <div className="prompt-sfx">{input}</div>
                <input type="text" placeholder="Press Enter to submit" onKeyDown={handleKeyDown}
                    value={input} onChange={updateInput} className="text-box">
                </input>
            </div>}
            {!isPlayer && <div>
                {game.player1.userInfo.displayName} and {game.player2.userInfo.displayName} are currently thinking of Prompts
            </div>}
        </div>
    )
}