import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../Store/store"
import { useState } from "react";
import { assignVotes } from "../Store/gameSlices";


export default function VotingPhase(){
    const game = useSelector((state:RootState)=>state.game);
    const dispatch = useDispatch<AppDispatch>();

    const [myVote, setVote] = useState<number>(0);

    function vote(playerNum: number){
        setVote(playerNum);
        if(playerNum === 1){
            dispatch(assignVotes({player1Votes: 1, player2Votes: 0}));
        }
        if(playerNum === 2){
            dispatch(assignVotes({player1Votes: 0, player2Votes: 1}));
        }//This should be changeds to sending player votes to server, and then receiving total votes later on to set both-
        //-player's scores instead of how it is right now
    }

    return (
        <div className="viewing"/*Actually the voting phase */>
            <div> Player 1: {game.player1.userInfo.displayName}<div>
                <iframe id="ytplayer" width="640" height="360" title={game.player1.chosenSong.title}
                    src={`https://www.youtube.com/embed/${game.player1.chosenSong.url}?autoplay=0&start=${game.player1.chosenSong.startTimeStamp}&end=${game.player1.chosenSong.endTimeStamp}`}></iframe>
                </div>
                <button disabled={myVote===1} onClick={()=>vote(1)} className="button">Vote for this player</button>
            </div>
            <div> Player 2: {game.player2.userInfo.displayName}<div>
                <iframe id="ytplayer" width="640" height="360" title={game.player2.chosenSong.title}
                    src={`https://www.youtube.com/embed/${game.player2.chosenSong.url}?autoplay=0&start=${game.player2.chosenSong.startTimeStamp}&end=${game.player2.chosenSong.endTimeStamp}`}></iframe>
                </div>
                <button disabled={myVote===2} onClick={()=>vote(2)} className="button">Vote for this player</button>
            </div>
        </div>
    )
}