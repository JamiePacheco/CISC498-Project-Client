import { useEffect, useState } from "react";
import SongEdit from "./SongEdit";

type items = {
    title:string;
    thumbnail:string;
    url: string;
    startTimeStamp: number;
    endTimeStamp: number;
}

export interface results{
    songs: items[];
    selected: items;
    setSelected: (link:items)=>void;
    timeStamp: number[];
    setTimeStamp: (time: number[]) => void;
    isEditing: boolean;
    setEditing: (isEditing: boolean) => void;
}

export default function SongResults({songs, setSelected, selected, timeStamp, setTimeStamp, isEditing, setEditing}:results){
    const [songList] = useState<items[]>(songs)

    // Creating a ui display for search results, see our group chat
    return (
        <div className="results">
            {isEditing && selected.title && <SongEdit timeStamp={timeStamp} setTimeStamp={setTimeStamp} song={selected} setEditing={setEditing}/>}
            {songList.map((song) => (
                <div className={`${selected===song? "selected" : "unselected"} songResults`} onClick={()=> {setSelected(song); setEditing(true)}}>
                    <img className="thumbnail" src={song.thumbnail} alt="Thumbnail"></img>
                    <div>{song.title}</div>
                </div>
            ))}
        </div>
    )
}