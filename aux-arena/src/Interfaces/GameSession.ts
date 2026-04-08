import { LobbySession } from "./LobbySession";
import { PlayerState } from "./PlayerState";
import { RoundSession } from "./RoundSession";

export type GameStatus = "STARTING" | "STARTED" | "FINISHING" | "FINISHED";

export interface GameSession {
    id? : number;
    lobbySession? : LobbySession
    gameStatus : GameStatus
    createdAt : string
    lastUpdatedAt : string
    players : Record<string, PlayerState>
    roundSession : RoundSession, 

}