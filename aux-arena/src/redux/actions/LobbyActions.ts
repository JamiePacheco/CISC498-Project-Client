import { GameLobbyEvent } from "../../Interfaces/socket/GameLobbyEvent"
import { UserSession } from "../../Interfaces/UserSession"

export enum LobbyAction {
    "JOIN_LOBBY",
    "LEAVE_LOBBY",
    "LOBBY_EVENT_RECIEVED"
}

export const joinLobby = (lobbyId : number, userSession : UserSession) => (
    {
        type : LobbyAction.JOIN_LOBBY,
        payload : {
            LobbyId : lobbyId,
            UserSession : userSession
        }
    }
)

export const leaveLobby = () => (
    {
        type : LobbyAction.LEAVE_LOBBY    
    }
)

export const lobbyEventRecieved = <T>(event : GameLobbyEvent<T>) => (
    {
        type : LobbyAction.LOBBY_EVENT_RECIEVED,
        payload : event
    }
)