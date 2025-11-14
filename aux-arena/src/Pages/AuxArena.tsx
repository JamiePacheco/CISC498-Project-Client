import { useState } from "react";
import {prompts} from "./Prompts"

//Picking Phase: Choosing a song (Only for participating players)
//Viewing Phase: Listening to song/ Waiting for songs to be chosen
//Voting Phase: Picking the song you like most/fits the theme best
type phases = "Picking" | "Viewing" | "Voting" | "Winner"; 
//Prompt Phase: Not implemented 

export default function AuxArena(){
    const rand = (Math.floor(Math.random() * prompts.length));
    const [currPrompt, setPrompt] = useState<string>(prompts[rand])
    const [currPhase, changePhase] = useState<phases>("Picking")
    // The rest will mostly be done by the backend 
    // Choosing song and voting will be buttons here but they send packets to the server where everything else is handled


    return (
        <div className="lobbystatus">
            {currPrompt} {rand}
        </div>
    )
}