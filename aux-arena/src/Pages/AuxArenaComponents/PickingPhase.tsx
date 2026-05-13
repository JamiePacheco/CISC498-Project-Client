import { useDispatch, useSelector } from "react-redux";
import Results from "../components/Results";
import { song } from "../Types/Game";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { selectSong } from "../../redux/Store/gameSlices";
import testCase from "../../testCaseTOBEREMOVED/aux_arena_bird_brain_test_data.json"

import "../Css/PixelCorners.css"
import "../Css/AuxArena.css"
import { PromptPair } from "../../Interfaces/PromptPair";
import { searchMusic } from "../../service/YoutubeService";
import { SonQueryResult } from "./SongQueryResults";

interface inputs{
    isPlayer: boolean;
}

export default function PickingPhase({
    isPlayer
    }:inputs){
    
    const game = useSelector((state: RootState)=>state.game);

    const prompts = useSelector((state : RootState)=>state.lobby.assignedPrompts);

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

    const [currentPrompt, setCurrentPrompt] = useState(0);


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

            searchMusic(input).then(res => {
                console.log(res)
                const searchResults = res.data.responseContent;

                console.log(searchResults)

                const list:song[] = searchResults.items.map((i: any) => ({
                    title: i.snippet.title,
                    thumbnail:i.snippet.thumbnails.high.url,
                    url: i.id.videoId,
                    startTimeStamp: 0,
                    endTimeStamp: 15
                }));
                setResults([...list]);
                setInput("");
            })    
        }
    };

    const selectPrompt = (idx : number) => {
        setCurrentPrompt(idx);
    }

    return (
         <div className="pickingBody pixel-corners">
            {isPlayer && <div className = "pickingContent">
                
                <div className="prompt-tabs">
                    {prompts.map((p, idx) => {
                        return (
                            <div onClick={() => selectPrompt(idx)} > Prompt {idx + 1} </div>
                        )
                    })
                    }
                </div>
                
                
                <div style = {{display : currentPrompt === 0 ? "block" : "none"}}>
                    <div> Prompt: "{prompts[0].prompt.prompt}"</div> 
                    <SonQueryResult promptPair={prompts[0]} />
                </div>
            
                <div style = {{display : currentPrompt === 1 ? "block" : "none"}}>
                    <div> Prompt: "{prompts[1].prompt.prompt}"</div> 
                    <SonQueryResult promptPair={prompts[1]} />
                </div>
                                
            </div>}
            {!isPlayer && <div>
                {game.player1.userInfo.displayName} and {game.player2.userInfo.displayName} are choosing songs, get ready to vote!
            </div>}
        </div>
    )
}