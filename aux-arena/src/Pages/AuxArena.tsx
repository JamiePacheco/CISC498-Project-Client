import { useState } from "react";
import "./AuxArena.css"
import "./Lobby.css"

//Prompt Phase: Players creates a prompt
//Picking Phase: Choosing a song (Only for participating players)
//Viewing Phase: Listening to song/ Waiting for songs to be chosen
//Voting Phase: Picking the song you like most/fits the theme best
type phases = "Prompt" | "Picking" | "Viewing" | "Voting" | "Winner"; 

export default function AuxArena(){
    const [currPrompt, setPrompt] = useState<string>("")
    const [currPhase, changePhase] = useState<phases>("Prompt")
    // The rest will mostly be done by the backend 
    // Choosing song and voting will be buttons here but they send packets to the server where everything else is handled


    return (
        <div className="game-screen">
            {currPhase==="Prompt" && <div>
                Type a prompt:
                <input type="text" className="text-box"></input>
            </div>}
        </div>
    )
}