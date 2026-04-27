import { useEffect, useState } from "react";
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
    const game = useSelector((state:RootState)=>state.game);
    const dispatch = useDispatch<AppDispatch>();

    // * Local States * //
    const [isPlayer, setPlayerStatus] = useState<boolean>(false);
    const [showChat, setChat] = useState<Boolean>(false);

    function toggleChat(){
        setChat(!showChat);
    }

    //To reset game state if I tab out of it
    useEffect(()=>{
        dispatch(endGame());
    }, [user, dispatch])

    useEffect(()=>{
        if(game.player1.userInfo.userID === user.userInfo.userID || game.player2.userInfo.userID === user.userInfo.userID){
            setPlayerStatus(true);
            console.log("Player status changed");
        }else{
            setPlayerStatus(false);
            console.log("Player status changed");
        }
    }, [game.player1.userInfo.userID, game.player2.userInfo.userID, user.userInfo.userID])

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
                {(game.gameInfo.gamePhase === 2 || game.gameInfo.gamePhase === 3) && 
                    <ViewingPhase/>}
                {game.gameInfo.gamePhase === 4 && 
                    <VotingPhase/>}
                {game.gameInfo.gamePhase === 5 && 
                    <WinnerPhase/>}
            </div>
        </div>
    )
}