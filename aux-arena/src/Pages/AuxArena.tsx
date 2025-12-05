import { useEffect, useState } from "react";
import "./AuxArena.css"
import "./Lobby.css"
import testCase from "../testCaseTOBEREMOVED/aux_arena_bird_brain_test_data.json"
import Results from "./Results";
import { useLocation } from "react-router-dom";

//Prompt Phase: Players creates a prompt
//Picking Phase: Choosing a song (Only for participating players)
//Viewing Phase: Listening to song/ Waiting for songs to be chosen
//      Spectators start here watching players in two previous phases
//Voting Phase: Picking the song you like most/fits the theme best
//Winner Phase: Show winner
type phases = "Prompt" | "Picking" | "Viewing1" | "Viewing2" | "Voting" | "Winner"; 
type pType = "Player" | "Spectator";

type items = { // Keeping only the two info needed for song picking, may need video link too 
    title: string;
    thumbnail: string; // Jpg link
    id: string;
}

type songInfo = {
    title: string;
    thumbnail: string;
    url: string;
    startTimeStamp: number;
    endTimeStamp: number;
}

type player = {
    name: string;
    playerType: pType;
    song: songInfo;
    playerScore: number;
}

export default function AuxArena(){
    const location = useLocation()
    const [playerList, setPlayers] = useState<player[]>([{name:location.state, playerType: "Player", 
            song:{title: "", thumbnail:"", url:"", startTimeStamp:0, endTimeStamp:15}, playerScore:0},
        {name:"Insert player name maybe", playerType: "Player", 
            song:{title: "", thumbnail:"", url:"", startTimeStamp:0, endTimeStamp:15}, playerScore:0},
        {name: "Player 3", playerType:"Spectator", 
            song: {title:"", thumbnail:"", url:"", startTimeStamp:0, endTimeStamp:15}, playerScore:0}])
    const [promptList, setList] = useState<string[]>([""])
    //Initially for prompt phase, then for picking phase
    const [input, setInput] = useState<string>("") //Send this one to server, used for each phase
    // Input can be different things depending on turn,
    // Prompt in prompt phase, search query in picking phase 
    const [currPhase, setPhase] = useState<phases>("Prompt")
    const [timer, setTimer] = useState<number>(30) 
    //Timer for each phase, pulled from server instead of local time
    //Check type on serverside and setType if spectator
    const [resultList, setResults] = useState<items[]>([])
    //Pulled from server
    const [selectedSong, setSelection] = useState<items>({title:"", thumbnail:"", id:""})// Selected by clientside player
    //Send this ^ to server 
    const [myTimeStamp, setTimeStamp] = useState<number[]>([0, 15]) // Keeps track of start and end of clip, [0] = start [1] = end
    //Send this ^ to server with selected song
    const [myVote, setVote] = useState<number>(0)
    //Sent vote to server, could change this to hold player name, but currently don't have that info
    const [gameResult, setGameResults] = useState<player[]>([playerList[0], playerList[1]])
    //Server tallies up votes and tells us whose winner, only need to know the player numbers of winner and loser and their score
    const [isEditing, setEditing] = useState<boolean>(false);

    function updateInput(event:any){
        setInput(event.target.value)
    }

    /**
     * Allows updates of any player number and any variable 
     * @param playerNum - player index number
     * @param updates - the variable you want changed
     * 
     * @example updatePlayers(1, {playerScore: 67});
     */
    function updatePlayers(playerNum: number, updates: Partial<player>){
        setPlayers(prev => 
            prev.map((player, i)=>
                i === playerNum ? {...player, ...updates} : player
            )
        )
    }

    function phaseChange(){
        switch (currPhase){
            case "Prompt":
                if(input != null)
                    setPhase("Picking")
                break
            case "Picking":
                if(resultList[0]){
                    setPhase("Viewing1")
                    /*updatePlayers(0, {song: {title: selectedSong.title, thumbnail: selectedSong.thumbnail, url: selectedSong.id, 
                        startTimeStamp: playerList[0].song.startTimeStamp, endTimeStamp: playerList[0].song.endTimeStamp}})
                        # I'm doing this automatically in the useEffect*/
                    updatePlayers(1, {song: {title: resultList[1].title, thumbnail: resultList[1].thumbnail, url: resultList[1].id, startTimeStamp: playerList[1].song.startTimeStamp,
                        endTimeStamp: playerList[1].song.endTimeStamp}})
                }
                else{
                    alert("NO SONGS SELECTED(click search bar and press enter)")
                }
                if(isEditing)
                    setEditing(false);
                break
            case "Viewing1":
                setPhase("Viewing2")
                break
            case "Viewing2":
                setPhase("Voting")
                break
            case "Voting":
                setPhase("Winner")
                break
            case "Winner":
                const newList = promptList.slice(1)//Remove current prompt, should be done on serverside?
                if(newList[0])
                    setList([...newList])
                else
                    setList([""])
                setPhase("Winner")
                if(promptList[0]==="")
                    setPhase("Prompt")//Looping for now, maybe change?
                else
                    setPhase("Picking")
                break
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

    useEffect(()=> {  
        updatePlayers(0, {song:{title: selectedSong.title, thumbnail: selectedSong.thumbnail, url: selectedSong.id,
            startTimeStamp: myTimeStamp[0], endTimeStamp:myTimeStamp[1]}})
    }, [selectedSong, myTimeStamp]) //Updates player1 song list automatically, FOR TESTING, YOU COULD REMOVE THIS
    // JUST REMEMBER TO UPDATE THE PLAYER'S INFO THROUGH THE SERVER or adjust the player number to be the current player

    function vote(playerNum: number){
        setVote(playerNum);
        updatePlayers(playerNum-1, {playerScore: playerList[playerNum-1].playerScore + 1})
        //Instead of updating player score here, its probably better to send your vote to server and let it calculate it
    }

    return (
        <div className="game-screen">
            <div className={"timer"}>{timer}</div>
            <button onClick={phaseChange} className="button" style={{position:"absolute", right:"1em"}}>Change Phase</button>
            Phase: {currPhase}
            <div className={"prompt-box"}>
                {`${promptList[0]}`? `Prompt: ${promptList[0]}` : "Choosing Prompt"}
            </div>
            <div className="game-display">
                {currPhase==="Prompt" && <div>
                    {playerList[0].playerType==="Player" && <div>
                        Type a prompt: <div className="prompt-sfx">{promptList[0]}</div>
                        <input type="text" placeholder="Press Enter to submit" onKeyDown={handleKeyDown}
                            value={input} onChange={updateInput} className="text-box">
                        </input>
                    </div>}
                    {playerList[0].playerType==="Spectator" && <div>
                        {playerList[0].name} and {playerList[1].name} are currently thinking of Prompts
                    </div>}
                </div>}
                {currPhase==="Picking" && <div>
                    {playerList[0].playerType==="Player" && <div> 
                        Search a song: 
                        <br></br>
                        <input type="text" placeholder="Press Enter to send" onKeyDown={handleKeyDown}
                            value={input} onChange={updateInput} className="text-box">
                        </input>
                        <br></br>
                        <div className="game-display">
                            Results: {selectedSong.title}
                            {resultList[0] && <Results isEditing={isEditing} setEditing={setEditing} timeStamp={myTimeStamp} setTimeStamp={setTimeStamp} songs={resultList} 
                            setSelected={setSelection} selected={selectedSong}></Results>}
                        </div>
                    </div>}
                    {playerList[0].playerType==="Spectator" && <div>
                        {playerList[0].name} and {playerList[1].name} are choosing songs, get ready to vote!
                    </div>}
                </div>}
                {currPhase==="Viewing1" && <div>
                    <div> Player 1: {playerList[0].name}<div>
                        <iframe id="ytplayer" width="640" height="360" title={playerList[0].song.title}
                            src={`https://www.youtube.com/embed/${playerList[0].song.url}?autoplay=1&start=${playerList[0].song.startTimeStamp}&end=${playerList[0].song.endTimeStamp}`}></iframe>
                        </div>
                        You'll get a chance to rewatch when voting
                    </div>
                </div>}
                {currPhase==="Viewing2" && <div>
                    <div> Player 2: {playerList[1].name}<div>
                        <iframe id="ytplayer" width="640" height="360" title={playerList[1].song.title}
                            src={`https://www.youtube.com/embed/${playerList[1].song.url}?autoplay=1&start=${playerList[1].song.startTimeStamp}&end=${playerList[1].song.endTimeStamp}`}></iframe>
                        </div>
                        You'll get a chance to rewatch when voting
                    </div>
                </div>}
                {currPhase==="Voting" && <div className="viewing">
                    <div> Player 1: {playerList[0].name}<div>
                        <iframe id="ytplayer" width="640" height="360" title={playerList[0].song.title}
                            src={`https://www.youtube.com/embed/${playerList[0].song.url}?&start=${playerList[0].song.startTimeStamp}&end=${playerList[0].song.endTimeStamp}`}></iframe>
                        </div>
                        <button disabled={myVote===1 ? true : false} onClick={()=>vote(1)} className="button">Vote for this player</button>
                    </div>
                    <div> Player 2: {playerList[1].name}<div>
                        <iframe id="ytplayer" width="640" height="360" title={playerList[1].song.title}
                            src={`https://www.youtube.com/embed/${playerList[1].song.url}?&start=${playerList[1].song.startTimeStamp}&end=${playerList[1].song.endTimeStamp}`}></iframe>
                        </div>
                        <button disabled={myVote===2 ? true : false} onClick={()=>vote(2)} className="button">Vote for this player</button>
                    </div>
                </div>}
                {currPhase==="Winner" && <div>
                    {playerList[0].playerScore < playerList[1].playerScore ? <div>{playerList[1].name} WINS</div> :
                     playerList[0].playerScore > playerList[1].playerScore ? <div>{playerList[0].name} WINS </div>:
                    <div>TIE</div>}
                    <div className="win-screen">
                        <div className={playerList[0].playerScore <= playerList[1].playerScore? "loser left" : "winner left"}>
                            {playerList[0].name}
                            <div>
                                <img src={playerList[0].song.thumbnail} alt="thumbnail"></img>
                                <div>{playerList[0].song.title}</div>
                                <br></br>
                                <div className="votes">Votes: {playerList[0].playerScore}</div>
                            </div>
                        </div>
                        <div className={playerList[1].playerScore <= playerList[0].playerScore? "loser right" : "winner right"}>
                            {playerList[1].name}
                            <div>
                                <img src={playerList[1].song.thumbnail} alt="thumbnail"></img>
                                <div>{playerList[1].song.title}</div>
                                <br></br>
                                <div className="votes">Votes: {playerList[1].playerScore}</div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}