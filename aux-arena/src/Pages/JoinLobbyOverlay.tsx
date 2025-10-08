import "../App.css"

export interface userStatus{
    username: string;
    setUser: (name: string)=>void;
    loggedIn: boolean;
    setJoining: (isJoining:boolean)=>void;
}

export default function LobbyOverlay({username, setUser, loggedIn, setJoining}: userStatus) {

    function changeName(event:any){
        setUser(event.target.value);
    }

    return(
        <div className="overlay">
            <div className="exit" onClick={()=>setJoining(false)}>x</div>
            Join Lobby
            <div className="input">
                Username:
                <div>
                    <input disabled={loggedIn} className="text-box" placeholder={username} type="text" onChange={changeName}></input>
                </div>
            </div>
            <div className="input">
                Lobby Code:
                <div>
                    <input className="text-box" type="text"></input>
                </div>
            </div>
        </div>
    )
}