import { JSX, useEffect, useState } from "react";
import "./Css/AuxArena.css"
import "./Css/Lobby.css"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { changePhase, endGame } from "../redux/Store/gameSlices";
import PromptPhase from "./AuxArenaComponents/PromptPhase";
import PickingPhase from "./AuxArenaComponents/PickingPhase";
import ChatBox from "./components/Chat";
import ViewingPhase from "./AuxArenaComponents/ViewingPhase";
import VotingPhase from "./AuxArenaComponents/VotingPhase";
import WinnerPhase from "./AuxArenaComponents/WinnerPhase";
import Timer from "./AuxArenaComponents/Timer";
import PlayerReadyCount from "./AuxArenaComponents/PlayerReadyCount";

//Prompt Phase: Players creates a prompt
//Picking Phase: Choosing a song (Only for participating players)
//Viewing Phase: Listening to song/ Waiting for songs to be chosen
//      Spectators start here watching players in two previous phases
//Voting Phase: Picking the song you like most/fits the theme best
//Winner Phase: Show winner

const phaseTranslation = [
    "Prompt",
    "Picking",
    "Viewing1",
    "Viewing2",
    "Voting",
    "Winner"
]


export default function AuxArena(){
    const user = useSelector((state:RootState)=>state.user);
    const game = useSelector((state:RootState)=>state.game);
    const lobby = useSelector((state:RootState)=>state.lobby);
    const userSession = useSelector((state:RootState) => state.lobby.userSession);
    const gameSession = useSelector((state:RootState) => state.lobby.gameSession);
    const roundSession = useSelector((state:RootState) => state.lobby.roundSession);


    const dispatch = useDispatch<AppDispatch>();

    // * Local States * //
    const [showChat, setChat] = useState<Boolean>(true);

    function toggleChat(){
        setChat(!showChat);
    }

    //To reset game state if I tab out of it
    useEffect(()=>{
        dispatch(endGame());
    }, [user, dispatch])


    function nextPhase(){
        if(game.gameInfo.gamePhase === 1){
            //setEditing(false);
            //setTimeStamp([0, 15]);
        }
        if(game.gameInfo.gamePhase === 5){
            dispatch(endGame());
        }else dispatch(changePhase());
    }

    if (!lobby.gameSession || !lobby.lobbySession || !lobby.roundSession) {
        return <div> error </div>
    }

    const roundPhaseComponents : Record<string, JSX.Element> = {
        "WRITING_PROMPT" : <PromptPhase  isPlayer={!userSession?.isSpectator}/>,
        "CHOOSING_SONG" : <PickingPhase  isPlayer={!userSession?.isSpectator}/>,
        "PRESENTING" : <ViewingPhase/>,
        "VOTING" : <VotingPhase/>,
        "SCORING" : <WinnerPhase/>
    }

    if (!userSession || !lobby || !gameSession || !roundSession) {
        return <div> No clue how you got here buddy... </div>
    }

    return (
         <div className="game-screen">
            <Timer duration={roundSession.phaseDuration} phase={roundSession.roundStatus} timed = {gameSession.gameSettings.timed} />
            
            <PlayerReadyCount/>

            <button onClick={nextPhase} className="button" style={{position:"absolute", right:"1em"}}>Change Phase</button>
            
            Phase: {roundSession.roundStatus}
            
            <div className="game-display">
                <button className={`chatButton ${showChat && "activeChat"}`} onClick={toggleChat} >Show Chat</button>
                {showChat && <ChatBox/>}
                {roundPhaseComponents[roundSession.roundStatus]}
            </div>
        </div>
    )
}