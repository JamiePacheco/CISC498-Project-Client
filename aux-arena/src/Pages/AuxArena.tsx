import { useEffect, useState } from "react";
import "./AuxArena.css"
import "./Lobby.css"
import testCase from "../testCaseTOBEREMOVED/aux_arena_bird_brain_test_data.json"
import Results from "./Results";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./Store/store";
import { assignVotes, changePhase, endGame, selectSong, setPlayer, setPrompt } from "./Store/gameSlices";

//Prompt Phase: Players creates a prompt
//Picking Phase: Choosing a song (Only for participating players)
//Viewing Phase: Listening to song/ Waiting for songs to be chosen
//      Spectators start here watching players in two previous phases
//Voting Phase: Picking the song you like most/fits the theme best
//Winner Phase: Show winner
type pType = "Player" | "Spectator";

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

const phaseTranslation: Record<number, string> = {
    0: "Prompt",
    1: "Picking",
    2: "Viewing1",
    3: "Viewing2",
    4: "Voting",
    5: "Winner"
}

export default function AuxArena(){
    const user = useSelector((state:RootState)=>state.user);
    const lobby = useSelector((state: RootState)=>state.lobby);
    const game = useSelector((state:RootState)=>state.game);
    const dispatch = useDispatch<AppDispatch>();

    // * Local States * //

    /**Local State used for different purposes throughout multiple phase
     *  * Prompt in prompt phase,
     *  * Search query in picking phase,
     * Remember to send input to server, and clear input after every use
     */
    const [input, setInput] = useState<string>("");
    const [resultList, setResults] = useState<songInfo[]>([]);
    //Pulled from server
    const [selectedSong, setSelection] = useState<songInfo>({title:"", thumbnail:"", url:"", startTimeStamp: 0, endTimeStamp: 15});// Selected by clientside player
    //Send this ^ to server, change this to songInfo type
    const [myTimeStamp, setTimeStamp] = useState<number[]>([0, 15]); // Keeps track of start and end of clip, [0] = start [1] = end
    //Send this ^ to server with selected song, add to above
    const [myVote, setVote] = useState<number>(0);
    const [isEditing, setEditing] = useState<boolean>(false);
    const [isPlayer, setPlayerStatus] = useState<boolean>(false);
    //Helper to check if user is an active player or not^

    function updateInput(event:any){
        setInput(event.target.value)
    }
    
    //To reset game state if I tab out of it
    // useEffect(()=>{
    //     dispatch(endGame());
    // }, [user])

    // useEffect(()=>{//Only for testing purposes, server will tell you players
    //     dispatch(setPlayer({playerInfo: user.userInfo, playerNumber:1}));
    //     dispatch(setPlayer({playerNumber: 2, playerInfo:lobby.users[1]}));
    // }, [game]);

    useEffect(()=>{
        const updatedSong = {
            ...selectedSong, 
            startTimeStamp: myTimeStamp[0], 
            endTimeStamp: myTimeStamp[1]
        };
        dispatch((selectSong({playerNumber: 1, songInfo: updatedSong})));
    }, [myTimeStamp])

    useEffect(()=>{
        if(game.player1.userInfo.userID === user.userInfo.userID || game.player2.userInfo.userID === user.userInfo.userID){
            setPlayerStatus(true);
            console.log("Player status changed");
        }else{
            setPlayerStatus(false);
            console.log("Player status changed");
        }
    })



    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if(game.gameInfo.gamePhase === 0){
                dispatch(setPrompt(input))// CHANGE THIS TO SENDING PROMPT TO SERVER
                setInput("")
            }
            if(game.gameInfo.gamePhase === 1){
                //Send "input" to server, input is song name here
                const list:songInfo[] = testCase.items.map(i => ({
                    title: i.snippet.title,
                    thumbnail:i.snippet.thumbnails.high.url,
                    url: i.id.videoId,
                    startTimeStamp: 0,
                    endTimeStamp: 15
                }));
                setResults([...list]);
                dispatch((selectSong({playerNumber:2, songInfo:list[1]})));
                setInput("");
            }
        }
    };

    useEffect(()=> {  
        dispatch(selectSong({playerNumber: 1, songInfo: selectedSong}))
    }, [selectedSong]) //Updates player1 song list automatically, FOR TESTING, YOU COULD REMOVE THIS
    // JUST REMEMBER TO UPDATE THE PLAYER'S INFO THROUGH THE SERVER or adjust the player number to be the current player

    function vote(playerNum: number){
        setVote(playerNum);
        if(playerNum === 1){
            dispatch(assignVotes({player1Votes: 1, player2Votes: 0}));
        }
        if(playerNum === 2){
            dispatch(assignVotes({player1Votes: 0, player2Votes: 1}));
        }//This should be changeds to sending player votes to server, and then receiving total votes later on to set both
        // player's scores instead of how it is right now
    }

    function nextPhase(){
        if(game.gameInfo.gamePhase === 1 && isEditing){
            setEditing(false);
            setTimeStamp([0, 15]);
        }
        if(game.gameInfo.gamePhase === 5){
            dispatch(endGame());
            setResults([]);
            setSelection({title:"", thumbnail:"", url:"", startTimeStamp: 0, endTimeStamp: 15});
        }else dispatch(changePhase());
    }

    return <div> TESTING </div>

    // return (
    //     <div className="game-screen">
    //         <div className={"timer"}>{game.gameInfo.countDown/**Change this to end time - curr time */}</div>
    //         <button onClick={nextPhase} className="button" style={{position:"absolute", right:"1em"}}>Change Phase</button>
    //         Phase: {phaseTranslation[game.gameInfo.gamePhase]}
    //         <div className={"prompt-box"}>
    //             {`${game.gameInfo.prompt != ""}`? `Prompt: ${game.gameInfo.prompt}` : "No Prompts Currently"}
    //         </div>
    //         <div className="game-display">
    //             {game.gameInfo.gamePhase===0 && <div>
    //                 {isPlayer && <div>
    //                     Type a prompt: <div className="prompt-sfx">{input}</div>
    //                     <input type="text" placeholder="Press Enter to submit" onKeyDown={handleKeyDown}
    //                         value={input} onChange={updateInput} className="text-box">
    //                     </input>
    //                 </div>}
    //                 {!isPlayer && <div>
    //                     {game.player1.userInfo.displayName} and {game.player2.userInfo.displayName} are currently thinking of Prompts
    //                 </div>}
    //             </div>}
    //             {game.gameInfo.gamePhase===1 && <div>
    //                 {isPlayer && <div> 
    //                     Search a song: 
    //                     <br></br>
    //                     <input type="text" placeholder="Press Enter to send" onKeyDown={handleKeyDown}
    //                         value={input} onChange={updateInput} className="text-box">
    //                     </input>
    //                     <br></br>
    //                     <div className="game-display">
    //                         Results: {selectedSong.title}
    //                         {resultList[0] && <Results isEditing={isEditing} setEditing={setEditing} timeStamp={myTimeStamp} setTimeStamp={setTimeStamp} songs={resultList} 
    //                         setSelected={setSelection} selected={selectedSong}></Results>}
    //                     </div>
    //                 </div>}
    //                 {!isPlayer && <div>
    //                     {game.player1.userInfo.displayName} and {game.player2.userInfo.displayName} are choosing songs, get ready to vote!
    //                 </div>}
    //             </div>}
    //             {game.gameInfo.gamePhase === 2 && <div>
    //                 <div> Player 1: {game.player1.userInfo.displayName}<div>
    //                     <iframe id="ytplayer" width="640" height="360" title={game.player1.chosenSong.title}
    //                         src={`https://www.youtube.com/embed/${game.player1.chosenSong.url}?autoplay=1&start=${game.player1.chosenSong.startTimeStamp}&end=${game.player1.chosenSong.endTimeStamp}`}></iframe>
    //                     </div>
    //                     You'll get a chance to rewatch when voting
    //                 </div>
    //             </div>}
    //             {game.gameInfo.gamePhase === 3 && <div>
    //                 <div> Player 2: {game.player2.userInfo.displayName}<div>
    //                     <iframe id="ytplayer" width="640" height="360" title={game.player2.chosenSong.title}
    //                         src={`https://www.youtube.com/embed/${game.player2.chosenSong.url}?autoplay=1&start=${game.player2.chosenSong.startTimeStamp}&end=${game.player2.chosenSong.endTimeStamp}`}></iframe>
    //                     </div>
    //                     You'll get a chance to rewatch when voting
    //                 </div>
    //             </div>}
    //             {game.gameInfo.gamePhase === 4 && <div className="viewing"/*Actually the voting phase */>
    //                 <div> Player 1: {game.player1.userInfo.displayName}<div>
    //                     <iframe id="ytplayer" width="640" height="360" title={game.player1.chosenSong.title}
    //                         src={`https://www.youtube.com/embed/${game.player1.chosenSong.url}?autoplay=1&start=${game.player1.chosenSong.startTimeStamp}&end=${game.player1.chosenSong.endTimeStamp}`}></iframe>
    //                     </div>
    //                     <button disabled={myVote===1 ? true : false} onClick={()=>vote(1)} className="button">Vote for this player</button>
    //                 </div>
    //                 <div> Player 2: {game.player2.userInfo.displayName}<div>
    //                     <iframe id="ytplayer" width="640" height="360" title={game.player2.chosenSong.title}
    //                         src={`https://www.youtube.com/embed/${game.player2.chosenSong.url}?autoplay=1&start=${game.player2.chosenSong.startTimeStamp}&end=${game.player2.chosenSong.endTimeStamp}`}></iframe>
    //                     </div>
    //                     <button disabled={myVote===2 ? true : false} onClick={()=>vote(2)} className="button">Vote for this player</button>
    //                 </div>
    //             </div>}
    //             {game.gameInfo.gamePhase === 5 && <div>
    //                 {game.player1.votes < game.player2.votes ? <div>{game.player2.userInfo.displayName} WINS</div> :
    //                  game.player1.votes > game.player2.votes ? <div>{game.player1.userInfo.displayName} WINS </div>:
    //                 <div>TIE</div>}
    //                 <div className="win-screen">
    //                     <div className={game.player1.votes <= game.player2.votes? "loser left" : "winner left"}>
    //                         {game.player1.userInfo.displayName}
    //                         <div>
    //                             <img src={game.player1.chosenSong.thumbnail} alt="thumbnail"></img>
    //                             <div>{game.player1.chosenSong.title}</div>
    //                             <br></br>
    //                             <div className="votes">Votes: {game.player1.votes}</div>
    //                         </div>
    //                     </div>
    //                     <div className={game.player2.votes <= game.player1.votes? "loser right" : "winner right"}>
    //                         {game.player2.userInfo.displayName}
    //                         <div>
    //                             <img src={game.player2.chosenSong.thumbnail} alt="thumbnail"></img>
    //                             <div>{game.player2.chosenSong.title}</div>
    //                             <br></br>
    //                             <div className="votes">Votes: {game.player2.votes}</div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>}
    //         </div>
    //     </div>
    // )
}