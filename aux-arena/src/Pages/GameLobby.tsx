import "./Lobby.css"

export interface information{
  user: string;
  loggedIn: string;
  lobbyPrivate: boolean;
  setPrivate: (something:boolean)=>void;
}

export default function GameLobby({user, loggedIn, lobbyPrivate, setPrivate}: information) {


    return (
        <div className="lobbyText">
            Hi {user}
            {!loggedIn && <div>Remember to make an account to save your games</div>}
        </div>
    )
}