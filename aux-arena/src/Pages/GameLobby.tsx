import { useEffect } from "react";
import "./Css/Lobby.css"
import "./Css/PixelCorners.css"
import { Link } from "react-router-dom";
import { User } from "./Types/User"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./Store/store";
import { addUser, removeUser } from "./Store/lobbySlices";
import ChatBox from "./components/Chat";


export default function GameLobby() {
    const user = useSelector((state:RootState) => state.user);
    const lobby = useSelector((state:RootState) => state.lobby);
    const dispatch = useDispatch<AppDispatch>();
    
    useEffect(()=>{
        if (!lobby.userList[0]) {
            dispatch(addUser(user.userInfo));
        }
    }, [lobby.userList, dispatch, user.userInfo])

    const player:User = {userID: 2, displayName: "Testing", isReady: false, isSpectator: false, score: 0};

    function updatePlayers(newPlayer:User){
        if(lobby.numPlayer < lobby.playerCap)
            dispatch(addUser(newPlayer));
        else
            alert("Max players exceeded")
    }

    

    function debugAdd(){
        updatePlayers(player);
        if(lobby.usersByID[player.userID]){
            alert("A user with this userID is already in this lobby")
        }
    }

    function debugRemove(){
        dispatch(removeUser(player));
    }

    return (
        <div>
            <div className="lobbyStatus">
                <div style={{paddingLeft: "1rem", height:"2.5rem"}}>Players: {lobby.numPlayer} / {lobby.playerCap} </div>
                <div>Lobby ID: {lobby.lobbyID}</div>
                {lobby.numPlayer > 1 && <Link to={"/aux-arena"} className="button">Start</Link>}
            </div>
            <button className="button" onClick={debugAdd}>Add Player</button>
            <button className="button" onClick={debugRemove}>Remove Player</button>
            <div className="playerbox pixel-corner">
                {lobby.userList.map((player)=>{
                    if(!player.displayName) return null;
                    return <div className="players">
                        {player.displayName}
                    </div>
                })}
            </div>
            <ChatBox/>
        </div>
    )
}