import { UserSession } from "./UserSession";

export type GameLobbyStatus = "WAITING" | "GAME_IN_PROGRESS" | "INACTIVE" | "GAME_FINISHED"

export interface LobbySession {
    id : number;
    lobbyCode : string;
    name : string;
    status : GameLobbyStatus;
    maxPlayers : number;
    maxCapacity : number;
    createdAt : string;
    privateStatus : boolean;
    password : string;
    // author : LobbyUser; TODO add this when user login is more developed
    lastUpdated : string;
    activeUsers : UserSession[];
}