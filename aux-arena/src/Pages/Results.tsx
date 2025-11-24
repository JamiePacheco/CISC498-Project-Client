import { useEffect, useState } from "react";
import SongEdit from "./SongEdit";

type items = {
    title:string;
    thumbnail:string;
    id: string;
}

export interface results{
    songs: items[];
    selected: items;
    setSelected: (link:items)=>void;
    timeStamp: number[];
    setTimeStamp: (time: number[]) => void;
}

export default function SongResults({songs, setSelected, selected, timeStamp, setTimeStamp}:results){
    const [songList] = useState<items[]>(songs)
    const [editingSong, setEditing] = useState<boolean>(false)

    useEffect(() => {
        setEditing(true);
    }, [selected])

    // Creating a ui display for search results, see our group chat
    return (
        <div className="results">
            {editingSong && selected.title && <SongEdit timeStamp={timeStamp} setTimeStamp={setTimeStamp} song={selected} setEditing={setEditing}/>}
            {songList.map((song) => (
                <div className={`${selected===song? "selected" : "unselected"} songResults`} onClick={()=> setSelected(song)}>
                    <img className="thumbnail" src={song.thumbnail} alt="Thumbnail"></img>
                    <div>{song.title}</div>
                </div>
            ))}
        </div>
    )
}