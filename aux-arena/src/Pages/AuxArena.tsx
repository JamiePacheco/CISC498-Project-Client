import { useEffect, useState } from "react";
import "./Css/AuxArena.css"
import "./Css/Lobby.css"
import Results from "./components/Results";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./Store/store";
import { assignVotes, changePhase, endGame, selectSong, setPlayer } from "./Store/gameSlices";
import ChatBox from "./components/Chat";
import PromptPhase from "./AuxArenaParts/PromptPhase";
import { song } from "./Types/Game";
import PickingPhase from "./AuxArenaParts/PickingPhase";

//Prompt Phase: Players creates a prompt
//Picking Phase: Choosing a song (Only for participating players)
//Viewing Phase: Listening to song/ Waiting for songs to be chosen
//      Spectators start here watching players in two previous phases
//Voting Phase: Picking the song you like most/fits the theme best
//Winner Phase: Show winner

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
    const [myVote, setVote] = useState<number>(0);
    const [isPlayer, setPlayerStatus] = useState<boolean>(false);
    //Helper to check if user is an active player or not^

    const [showChat, setChat] = useState<Boolean>(false);

    function toggleChat(){
        setChat(!showChat);
    }
    
    //To reset game state if I tab out of it
    useEffect(()=>{
        dispatch(endGame());
    }, [user, dispatch])

    useEffect(()=>{//Only for testing purposes, server will tell you players
        dispatch(setPlayer({playerInfo: user.userInfo, playerNumber:1}));
        dispatch(setPlayer({playerNumber: 2, playerInfo:lobby.userList[1]}));
    }, [game, dispatch, lobby.userList, user.userInfo]);

    useEffect(()=>{
        if(game.player1.userInfo.userID === user.userInfo.userID || game.player2.userInfo.userID === user.userInfo.userID){
            setPlayerStatus(true);
            console.log("Player status changed");
        }else{
            setPlayerStatus(false);
            console.log("Player status changed");
        }
    }, [game.player1.userInfo.userID, game.player2.userInfo.userID, user.userInfo.userID])

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
        if(game.gameInfo.gamePhase === 1){
            //setEditing(false);
            //setTimeStamp([0, 15]);
        }
        if(game.gameInfo.gamePhase === 5){
            dispatch(endGame());
        }else dispatch(changePhase());
    }

    return (
        <div className="game-screen">
            <div className={"timer"}>{game.gameInfo.countDown/**Change this to end time - curr time */}</div>
            <button onClick={nextPhase} className="button" style={{position:"absolute", right:"1em"}}>Change Phase</button>
            Phase: {phaseTranslation[game.gameInfo.gamePhase]}
            <div className={"prompt-box"}>
                {`${game.gameInfo.prompt !== ""}`? `Prompt: ${game.gameInfo.prompt}` : "No Prompts Currently"}
            </div>
            <div className="game-display">
                <button className={`chatButton ${showChat && "activeChat"}`} onClick={toggleChat} >Show Chat</button>
                {showChat && <ChatBox/>}
                {game.gameInfo.gamePhase===0 && 
                    <PromptPhase isPlayer={isPlayer}/>
                }
                {game.gameInfo.gamePhase===1 && 
                    <PickingPhase isPlayer={isPlayer}/>}
                {game.gameInfo.gamePhase === 2 && <div>
                    <div> Player 1: {game.player1.userInfo.displayName}<div>
                        <iframe id="ytplayer" width="640" height="360" title={game.player1.chosenSong.title}
                            src={`https://www.youtube.com/embed/${game.player1.chosenSong.url}?autoplay=1&start=${game.player1.chosenSong.startTimeStamp}&end=${game.player1.chosenSong.endTimeStamp}`}></iframe>
                        </div>
                        You'll get a chance to rewatch when voting
                    </div>
                </div>}
                {game.gameInfo.gamePhase === 3 && <div>
                    <div> Player 2: {game.player2.userInfo.displayName}<div>
                        <iframe id="ytplayer" width="640" height="360" title={game.player2.chosenSong.title}
                            src={`https://www.youtube.com/embed/${game.player2.chosenSong.url}?autoplay=1&start=${game.player2.chosenSong.startTimeStamp}&end=${game.player2.chosenSong.endTimeStamp}`}></iframe>
                        </div>
                        You'll get a chance to rewatch when voting
                    </div>
                </div>}
                {game.gameInfo.gamePhase === 4 && <div className="viewing"/*Actually the voting phase */>
                    <div> Player 1: {game.player1.userInfo.displayName}<div>
                        <iframe id="ytplayer" width="640" height="360" title={game.player1.chosenSong.title}
                            src={`https://www.youtube.com/embed/${game.player1.chosenSong.url}?autoplay=1&start=${game.player1.chosenSong.startTimeStamp}&end=${game.player1.chosenSong.endTimeStamp}`}></iframe>
                        </div>
                        <button disabled={myVote===1 ? true : false} onClick={()=>vote(1)} className="button">Vote for this player</button>
                    </div>
                    <div> Player 2: {game.player2.userInfo.displayName}<div>
                        <iframe id="ytplayer" width="640" height="360" title={game.player2.chosenSong.title}
                            src={`https://www.youtube.com/embed/${game.player2.chosenSong.url}?autoplay=1&start=${game.player2.chosenSong.startTimeStamp}&end=${game.player2.chosenSong.endTimeStamp}`}></iframe>
                        </div>
                        <button disabled={myVote===2 ? true : false} onClick={()=>vote(2)} className="button">Vote for this player</button>
                    </div>
                </div>}
                {game.gameInfo.gamePhase === 5 && <div>
                    {game.player1.votes < game.player2.votes ? <div>{game.player2.userInfo.displayName} WINS</div> :
                     game.player1.votes > game.player2.votes ? <div>{game.player1.userInfo.displayName} WINS </div>:
                    <div>TIE</div>}
                    <div className="win-screen">
                        <div className={game.player1.votes <= game.player2.votes? "loser left" : "winner left"}>
                            {game.player1.userInfo.displayName}
                            <div>
                                <img src={game.player1.chosenSong.thumbnail} alt="thumbnail"></img>
                                <div>{game.player1.chosenSong.title}</div>
                                <br></br>
                                <div className="votes">Votes: {game.player1.votes}</div>
                            </div>
                        </div>
                        <div className={game.player2.votes <= game.player1.votes? "loser right" : "winner right"}>
                            {game.player2.userInfo.displayName}
                            <div>
                                <img src={game.player2.chosenSong.thumbnail} alt="thumbnail"></img>
                                <div>{game.player2.chosenSong.title}</div>
                                <br></br>
                                <div className="votes">Votes: {game.player2.votes}</div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}