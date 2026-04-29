import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { decrement } from "../../redux/Store/gameSlices";
import "../Css/AuxArena.css"
import { useEffect } from "react";

const translation = ["Prompt", "Picking", "Viewing1", "Viewing2", "Voting", "Winner"];


export default function Timer(){
    const game = useSelector((state: RootState)=> state.game);
    const dispatch = useDispatch();

    useEffect(()=>{
        const interval = setInterval(() => {
        dispatch(decrement());
    }, 1000);

    return () => clearInterval(interval);
    }, [game.gameInfo.countDown, dispatch])

    return (
        <div>
            <div className={`${translation[game.gameInfo.gamePhase]} timer`}>{game.gameInfo.countDown}</div>
        </div>
    )
}