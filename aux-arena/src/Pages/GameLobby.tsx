import "./Lobby.css"

export interface information{
  user: string;
  loggedIn: string;
}

export default function GameLobby({user, loggedIn}: information) {


    return (
        <div className="lobbyText">
            Hi {user}
            {!loggedIn && <div>Remember to make an account to save your games</div>}
        </div>
    )
}