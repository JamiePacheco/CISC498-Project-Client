import { useState } from "react";

type items = {
    title:string;
    thumbnail:string;
    id: string;
}

export interface results{
    songs: items[];
    selected: items;
    setSelected: (link:items)=>void;
}

export default function SongResults({songs, setSelected, selected}:results){
    const [songList] = useState<items[]>(songs)

    // Creating a ui display for search results, see our group chat
    return (
        <div className="results">
            {songList.map((song) => (
                <div className={`${selected===song? "selected" : "unselected"} songResults`} onClick={()=> setSelected(song)}>
                    <img className="thumbnail" src={song.thumbnail} alt="Thumbnail"></img>
                    <div>{song.title}</div>
                </div>
            ))}
        </div>
    )
}