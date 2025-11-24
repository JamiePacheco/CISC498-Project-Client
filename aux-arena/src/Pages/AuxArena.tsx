import { useEffect, useState } from "react";
import "./AuxArena.css"
import "./Lobby.css"
import testCase from "../testCaseTOBEREMOVED/aux_arena_bird_brain_test_data.json"
import Results from "./Results";
import background from "../Images/PlaceHolderBackground.png"

//Prompt Phase: Players creates a prompt
//Picking Phase: Choosing a song (Only for participating players)
//Viewing Phase: Listening to song/ Waiting for songs to be chosen
//      Spectators start here watching players in two previous phases
//Voting Phase: Picking the song you like most/fits the theme best
//Winner Phase: Show winner
type phases = "Prompt" | "Picking" | "Viewing" | "Winner"; 
type player = "Player" | "Spectator";

type items = { // Keeping only the two info needed for song picking, may need video link too 
    title: string;
    thumbnail: string; // Jpg link
    id: string;
}

export default function AuxArena(){
    const [playerNames, setNames] = useState<string[]>(["Insert player name here", "Insert player name maybe"])
    const [promptList, setList] = useState<string[]>([""])
    //Initially for prompt phase, then for picking phase
    const [input, setInput] = useState<string>("") //Send this one to server, used for each phase
    // Input can be different things depending on turn,
    // Prompt in prompt phase, search query in picking phase 
    const [currPhase, setPhase] = useState<phases>("Prompt")
    const [timer, setTimer] = useState<number>(90) 
    //Timer for each phase, pulled from server instead of local time
    const [playerType, setType] = useState<player>("Player") 
    //Check type on serverside and setType if spectator
    const [resultList, setResults] = useState<items[]>([])
    //Pulled from server
    const [selectedSong, setSelection] = useState<items>({title:"", thumbnail:"", id:""})// Selected by clientside player
    //Send this ^ to server
    const [timeStamp, setTimeStamp] = useState<number[]>([0, 15]) // Keeps track of start and end of clip, [0] = start [1] = end
    //Send this ^ to server with selected song
    const [songList, setSongs] = useState<items[]>([])
    const [myVote, setVote] = useState<number>(0)
    //Sent vote to server, could change this to hold player name, but currently don't have that info


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
                if(resultList[0]){
                    setPhase("Viewing")
                    setSongs([resultList[0], resultList[1]])
                }
                else{
                    alert("NO SONGS SELECTED(click search bar and press enter)")
                }
                break
            case "Viewing":
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
            if(currPhase === "Picking"){
                //Send "input" to server, input is song name here
                const list: items[] = testCase.items.map(i => ({
                    title: i.snippet.title,
                    thumbnail:i.snippet.thumbnails.high.url,
                    id: i.id.videoId
                }))
                setResults([...list])
                setInput("")
            }
        }
    };

    function vote(playerNum: number){
        setVote(playerNum);
    }

    return (
        <div className="game-screen">
            <div className={`${currPhase} timer`}>{timer}</div>
            <button onClick={phaseChange} className="button" style={{position:"absolute", right:"1em"}}>Change Phase</button>
            Phase: {currPhase}
            <div className={"prompt-box"}>
                {`${promptList[0]}`===""? "Choosing Prompt" : `Prompt: ${promptList[0]}`}
            </div>
            <div className="game-display">
                {currPhase==="Prompt" && <div>
                    {playerType==="Player" && <div>
                        Type a prompt: <div className="prompt-sfx">{promptList[0]}</div>
                        <input type="text" placeholder="Press Enter to submit" onKeyDown={handleKeyDown}
                            value={input} onChange={updateInput} className="text-box">
                        </input>
                    </div>}
                    {playerType==="Spectator" && <div>
                        {playerNames[0]} and {playerNames[1]} are currently thinking of Prompts
                    </div>}
                </div>}
                {currPhase==="Picking" && <div>
                    {playerType==="Player" && <div> 
                        Search a song: 
                        <br></br>
                        <input type="text" placeholder="Press Enter to send" onKeyDown={handleKeyDown}
                            value={input} onChange={updateInput} className="text-box">
                        </input>
                        <br></br>
                        <div className="game-display">
                            Results: {selectedSong.title}
                            {resultList[0] && <Results timeStamp={timeStamp} setTimeStamp={setTimeStamp} songs={resultList} 
                            setSelected={setSelection} selected={selectedSong}></Results>}
                        </div>
                    </div>}
                    {playerType==="Spectator" && <div>
                        {playerNames[0]} and {playerNames[1]} are choosing songs, get ready to vote!
                    </div>}
                </div>}
                {currPhase==="Viewing" && <div className="viewing">
                    <div> Player 1: {playerNames[0]}<div>
                        <iframe id="ytplayer" width="640" height="360" title={songList[0].title}
                            src={`https://www.youtube.com/embed/${songList[0].id}?autoplay=1`}></iframe>
                        </div>
                        <button disabled={myVote===1 ? true : false} onClick={()=>vote(1)} className="button">Vote for this player</button>
                    </div>
                    <div> Player 2: {playerNames[1]}<div>
                        <iframe id="ytplayer" width="640" height="360" title={songList[1].title}
                            src={`https://www.youtube.com/embed/${songList[1].id}`}></iframe>
                        </div>
                        <button disabled={myVote===2 ? true : false} onClick={()=>vote(2)} className="button">Vote for this player</button>
                    </div>
                </div>}
                {currPhase==="Winner" && <div>
                    
                </div>}
            </div>
        </div>
    )
}