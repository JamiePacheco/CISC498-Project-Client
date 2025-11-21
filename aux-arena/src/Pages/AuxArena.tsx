import { useEffect, useState } from "react";
import "./AuxArena.css"
import "./Lobby.css"

//Prompt Phase: Players creates a prompt
//Picking Phase: Choosing a song (Only for participating players)
//Viewing Phase: Listening to song/ Waiting for songs to be chosen
//      Spectators start here watching players in two previous phases
//Voting Phase: Picking the song you like most/fits the theme best
//Winner Phase: Show winner
type phases = "Prompt" | "Picking" | "Viewing" | "Voting" | "Winner"; 
type player = "Player" | "Spectator";

export default function AuxArena(){
    const [promptList, setList] = useState<string[]>([])
    const [input, setInput] = useState<string>("") //Send this one to server, used for each phase
    // Input can be different things depending on turn,
    // Prompt in prompt phase, maybe more I didn't get to the other phases yet 
    const [currPhase, setPhase] = useState<phases>("Prompt")
    const [timer, setTime] = useState<number>(90) //Timer for each phase, pulled from server instead of local time
    const [playerType, setType] = useState<player>("Player") //Check type on serverside and setType if spectator

    /*useEffect(()=>{ //Thought of a better idea, keeping in case I need it back
        if(playerType === "Spectator")
            setPhase("Viewing");
        console.log("Hey Listen!")
    }, [playerType])*/ 

    function updateInput(event:any){
        setInput(event.target.value)
    }

    function phaseChange(){
        switch (currPhase){
            case "Prompt":
                if(input != null)
                    setPhase("Picking")
                break
            case "Picking":
                setPhase("Viewing")
                break
            case "Viewing":
                setPhase("Voting")
                break
            case "Voting":
                setPhase("Winner")
                const newList = promptList.slice(1)
                setList([...newList])
                break
            case "Winner":
                if(promptList.length === 0)
                    setPhase("Prompt")//Looping for now, maybe change?
                else
                    setPhase("Picking")
                break;
            default:
                break
        }
        
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if(currPhase === "Prompt"){
                setList([input])// CHANGE THIS TO SENDING PROMPT TO SERVER
                setInput("")
            }
        }
    };

    return (
        <div className="game-screen">
            <div className={`${currPhase} timer`}>{timer}</div>
            <button onClick={phaseChange} className="button" style={{position:"absolute", right:"1em"}}>Change Phase</button>
            Phase: {currPhase}
            <div className="game-display">
                {currPhase==="Prompt" && playerType==="Player" && <div>
                    Type a prompt: <div className="prompt-sfx">{promptList[0]}</div>
                    <input type="text" placeholder="Press Enter to submit" onKeyDown={handleKeyDown}
                        value={input} onChange={updateInput} className="text-box">
                    </input>
                    <br></br>
                </div>}
                {currPhase==="Picking" && playerType==="Player" && <div>
                    Search a song: 
                    <br></br>
                    <input type="text" placeholder="Press Enter to submit" onKeyDown={handleKeyDown}
                        value={input} onChange={updateInput} className="text-box">
                    </input>
                    <br></br>
                    <div className="game-display">
                        Results:
                    </div>
                    
                </div>}
                {(currPhase==="Viewing" || currPhase==="Picking" || currPhase==="Prompt") && playerType==="Spectator" && <div>
                    
                </div>}
                {currPhase==="Voting" && <div>
                    
                </div>}
                {currPhase==="Winner" && <div>
                    
                </div>}
            </div>
        </div>
    )
}