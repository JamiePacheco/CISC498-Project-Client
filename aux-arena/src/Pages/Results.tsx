import { useState } from "react";

type items = {
    title:string;
    thumbnail:string;
    id: string;
}

export interface results{
    songs: items[];
    selected: string;
    setSelected: (link:string)=>void;
}

export default function SongResults({songs, setSelected, selected}:results){
    const [songList] = useState<items[]>(songs)

    // Creating a ui display for search results, see our group chat
    return (
        <div className="results">
            {songList.map((song) => (
                <div className={`${selected===song.id? "selected" : "unselected"} songResults`} onClick={()=> setSelected(song.id)}>
                    <img className="thumbnail" src={song.thumbnail} alt="Thumbnail"></img>
                    <div>{song.title}</div>
                </div>
            ))}
        </div>
    )
}