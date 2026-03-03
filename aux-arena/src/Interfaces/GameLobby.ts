import { GameLobbyStatus } from "./LobbySession";

export interface GameLobby {
    id? : number;
    lobbyCode? : string;
    name : string;
    status? : GameLobbyStatus;
    maxPlayers? : number;
    maxCapacity? : number;
    createdAt? : string;
    privateStatus : boolean;
    password? : string;
    // author : LobbyUser; TODO add this when user login is more developed
    lastUpdated? : string;
}