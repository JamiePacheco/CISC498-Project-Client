import { useDispatch, useSelector } from "react-redux";
import Results from "../components/Results";
import { song } from "../Types/Game";
import { AppDispatch, RootState } from "../Store/store";
import { useEffect, useState } from "react";
import { selectSong } from "../Store/gameSlices";
import testCase from "../../testCaseTOBEREMOVED/aux_arena_bird_brain_test_data.json"

interface inputs{
    isPlayer: boolean;
}

export default function PickingPhase({
    isPlayer
    }:inputs){
    
    const game = useSelector((state: RootState)=>state.game);
    const dispatch = useDispatch<AppDispatch>();
    
    const [input, setInput] = useState<string>("");
    const [selectedSong, setSelection] = useState<song>({title:"", thumbnail:"", url:"", startTimeStamp: 0, endTimeStamp: 15})
    //Selected by clientside player
    //Send this ^ to server, change this to songInfo type
    const [myTimeStamp, setTimeStamp] = useState<number[]>([0, 15]); // Keeps track of start and end of clip, [0] = start [1] = end
    //Send this ^ to server with selected song, add to above
    const [isEditing, setEditing] = useState<boolean>(false);
    const [resultList, setResults] = useState<song[]>([]);
    //Pulled from server

    function updateInput(event:any){
        setInput(event.target.value)
    }

    useEffect(()=> {  
        dispatch(selectSong({playerNumber: 1, songInfo: selectedSong}))
    }, [selectedSong, dispatch]) //Updates player1 song list automatically, FOR TESTING, YOU COULD REMOVE THIS
    // JUST REMEMBER TO UPDATE THE PLAYER'S INFO THROUGH THE SERVER or adjust the player number to be the current player

    useEffect(()=>{
        const updatedSong = {
            ...selectedSong, 
            startTimeStamp: myTimeStamp[0], 
            endTimeStamp: myTimeStamp[1]
        };
        dispatch((selectSong({playerNumber: 1, songInfo: updatedSong})));
    }, [myTimeStamp, dispatch, selectedSong]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            //Send "input" to server, input is song name here
            const list:song[] = testCase.items.map(i => ({
                title: i.snippet.title,
                thumbnail:i.snippet.thumbnails.high.url,
                url: i.id.videoId,
                startTimeStamp: 0,
                endTimeStamp: 15
            }));
            setResults([...list]);
            dispatch((selectSong({playerNumber:2, songInfo:list[1]})));
            setInput("");
        }
    };

    return (
         <div>
            {isPlayer && <div> 
                Search a song: 
                <br></br>
                <input type="text" placeholder="Press Enter to send" onKeyDown={handleKeyDown}
                    value={input} onChange={updateInput} className="text-box">
                </input>
                <br></br>
                <div className="game-display">
                    Results: {selectedSong.title}
                    {resultList[0] && <Results isEditing={isEditing} setEditing={setEditing} timeStamp={myTimeStamp} setTimeStamp={setTimeStamp} songs={resultList} 
                    setSelected={setSelection} selected={selectedSong}></Results>}
                </div>
            </div>}
            {!isPlayer && <div>
                {game.player1.userInfo.displayName} and {game.player2.userInfo.displayName} are choosing songs, get ready to vote!
            </div>}
        </div>
    )
}
