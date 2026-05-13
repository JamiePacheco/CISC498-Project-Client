import "../Css/PixelCorners.css"
import "../Css/AuxArena.css"
import { searchMusic } from "../../service/YoutubeService";
import { song } from "../Types/Game";
import { PromptPair } from "../../Interfaces/PromptPair";
import { useState } from "react";
import Results from "../components/Results";
import { PromptSubmission } from "../../Interfaces/PromptSubmission";
import { useDispatch, useSelector } from "react-redux";
import { sendSong } from "../../redux/slices/lobbySlice";
import { RootState } from "../../redux/store";

export function SonQueryResult({promptPair} : {promptPair : PromptPair}) {

    const lobbySession = useSelector((state: RootState)=>state.lobby.lobbySession)

    const [input, setInput] = useState<string>("");
    const [selectedSong, setSelection] = useState<song>({title:"", thumbnail:"", url:"", startTimeStamp: 0, endTimeStamp: 15})
    //Selected by clientside player
    //Send this ^ to server, change this to songInfo type
    const [myTimeStamp, setTimeStamp] = useState<number[]>([0, 15]); // Keeps track of start and end of clip, [0] = start [1] = end
    //Send this ^ to server with selected song, add to above
    const [isEditing, setEditing] = useState<boolean>(false);
    const [resultList, setResults] = useState<song[]>([]);
    //Pulled from server

    const [submitted, setSubmitted] = useState(false);

    const dispatch = useDispatch();




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
    

    const handleSongSubmission = () => {
        const promptSubmission : PromptSubmission = {
            "songChoice" : {
                "title" : selectedSong.title,
                "thumbnail" : selectedSong.thumbnail,
                "videoUrl" : selectedSong.url,
                "timestampEndAt" : selectedSong.endTimeStamp,
                "timestampStartAt" : selectedSong.startTimeStamp
            },
            "promptPairId" : promptPair.promptId
        };

        if (!lobbySession) return

        dispatch(
            sendSong(
                {
                    "gameLobby" : lobbySession,
                    "promptSubmission" : promptSubmission
                }
            )
        )
    }



    function updateInput(event:any){
        setInput(event.target.value)
    }

    console.log(selectedSong)
    
    return <div>
                <span>Search a song:</span> 
                
                <br></br>
                <input type="text" placeholder="Press Enter to send" onKeyDown={handleKeyDown}
                    value={input} disabled = {submitted}  onChange={updateInput} className="text-box"> 
                </input>
                <br></br>

                <div className="game-display">
                    Results: {selectedSong.title}
                    {resultList[0] && 
                        <Results 
                            isEditing={isEditing} 
                            setEditing={setEditing} 
                            timeStamp={myTimeStamp} 
                            setTimeStamp={setTimeStamp} 
                            songs={resultList} 
                            setSelected={setSelection} 
                            selected={selectedSong}
                            submitted = {submitted}
                            handleSubmission = {handleSongSubmission}
                        />
                    }
                </div>



    </div>

}