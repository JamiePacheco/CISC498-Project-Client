import { useEffect, useState } from "react";
import "./overlay.css"

type items = {
    title:string;
    thumbnail:string;
    id:string;
}

type options = "start" | "end";

export interface song{
    song: items;
    timeStamp: number[];
    setTimeStamp: (time:number[]) => void;
    setEditing: (bool:boolean) => void;
}

export default function SongEdit({song, timeStamp, setTimeStamp, setEditing}: song){
    const [startText, setStart] = useState<string>(`${Math.floor(timeStamp[0] / 60)}:${(timeStamp[0] % 60).toString().padStart(2, "0")}`)
    const [endText, setEnd] = useState<string>(`${Math.floor(timeStamp[1] / 60)}:${(timeStamp[1] % 60).toString().padStart(2, "0")}`)
    const [lastChange, setchanged] = useState<options>("start");

    function convertTime(time:string): number{
        if(/^\d{1,2}:\d{1,2}$/.test(time) || /^\d{1}:\d{1,2}$/.test(time)){ //If time is m:ss or mm:ss
            const [minutes, seconds] = time.split(":");
            console.log("reached minutes case");
            return (Number(minutes) * 60) + Number(seconds)
        }
        else if(/^\d+$/.test(time)){
            console.log("reached seconds case");
            return Number(time)
        }
        else {
            alert("Please use mm:ss or s format, where m and s are numbers representing minute and seconds\nExample: 1:20 or 78\n");
        }
        return 0;
    }

    function changeStart(event:any){
        setStart(event?.target.value)

    }

    function saveTime(){
        let start = convertTime(startText);
        let end = convertTime(endText)
        if(end > start + 30 || start > end){
            if(lastChange === "start")
                end = start + 30
            else
                start = (end-30)>0 ? end - 30 : 0;
        }
        setTimeStamp([start, end]);
    }

    useEffect(() => {
        setStart(`${Math.floor(timeStamp[0] / 60)}:${(timeStamp[0] % 60).toString().padStart(2, "0")}`)
        setEnd(`${Math.floor(timeStamp[1] / 60)}:${(timeStamp[1] % 60).toString().padStart(2, "0")}`)
    }, [timeStamp])

    return(
        <div className="songEdit">
            <div className="exit" onClick={() => setEditing(false)}>X</div>
            Select a 15-30 second section:
            <iframe id="ytplayer" width="640" height="360" title={song.title}
                src={`https://www.youtube.com/embed/${song.id}?start=${timeStamp[0]}&end=${timeStamp[1]}`}/>    
            <div className="timeStamp">
                <div>
                    Start:
                    <input value={startText} type="text"
                    onChange={(e) => {setStart(e.target.value); setchanged("start")}} className="small-text-box"></input>
                </div>
                <button className="button" onClick={saveTime}>Set Timestamps</button>
                <div>
                    End:
                    <input value={endText} type="text"
                    onChange={(e) => {setEnd(e.target.value); setchanged("end")}} className="small-text-box"></input>
                </div>
            </div>
            Input "minutes:seconds" or "seconds" 
            <br></br>
            Press the button to set the timestamps
        </div>
    )
}