import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { decrement } from "../../redux/Store/gameSlices";
import "../Css/AuxArena.css"
import { useEffect, useState } from "react";
import { RoundStatus } from "../../Interfaces/RoundSession";

const translation = ["Prompt", "Picking", "Viewing1", "Viewing2", "Voting", "Winner"];


export default function Timer({duration, phase, timed} : {duration : number, phase : RoundStatus, timed : boolean}){
    // const game = useSelector((state: RootState)=> state.game);
    // const dispatch = useDispatch();

    const [time, setTime] = useState(duration);

    
    useEffect(() => {
        setTime(duration)
    }, [duration, phase])

    console.log("Component Loaded: " + phase + "," + time)
    useEffect(()=>{
        if (timed) {
            const interval = setInterval(() => {
                if (time > 0) {
                    setTime(prev => prev - 1);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [time, phase, duration, timed]);


    return (
        <div>
            <div className={`timer`}>{ timed ? time : '\u221E' }</div>
        </div>
    )
}