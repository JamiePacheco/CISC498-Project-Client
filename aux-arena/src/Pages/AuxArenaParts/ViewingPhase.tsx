import { useSelector } from "react-redux"
import { RootState } from "../Store/store"


export default function ViewingPhase(){
    const game = useSelector((state:RootState)=> state.game);

    return (
        <div>
            {game.gameInfo.gamePhase === 2 && <div> Player 1: {game.player1.userInfo.displayName}<div>
                <iframe id="ytplayer" width="640" height="360" title={game.player1.chosenSong.title}
                    src={`https://www.youtube.com/embed/${game.player1.chosenSong.url}?autoplay=1&start=${game.player1.chosenSong.startTimeStamp}&end=${game.player1.chosenSong.endTimeStamp}`}></iframe>
                </div>
            </div>}
            {game.gameInfo.gamePhase === 3 && <div> Player 2: {game.player2.userInfo.displayName}<div>
                <iframe id="ytplayer" width="640" height="360" title={game.player2.chosenSong.title}
                    src={`https://www.youtube.com/embed/${game.player2.chosenSong.url}?autoplay=1&start=${game.player2.chosenSong.startTimeStamp}&end=${game.player2.chosenSong.endTimeStamp}`}></iframe>
                </div>
            </div>}
            You'll get a chance to rewatch when voting
        </div>
    )
}