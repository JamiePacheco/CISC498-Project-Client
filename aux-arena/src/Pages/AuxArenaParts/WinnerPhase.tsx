import { useSelector } from "react-redux"
import { RootState } from "../Store/store"


export default function WinnerPhase(){
    const game = useSelector((state:RootState)=>state.game);

    return (
        <div>
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
        </div>
    )
}