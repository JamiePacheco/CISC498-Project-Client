import { LobbySession } from "./LobbySession";

export type GameStatus = "STARTING" | "STARTED" | "FINISHING" | "FINISHED";

export interface GameSession {
    id? : number;
    lobbySession? : LobbySession
    gameStatus : GameStatus



}