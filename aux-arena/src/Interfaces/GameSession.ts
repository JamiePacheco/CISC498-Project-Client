import { GameSettings } from "./GameSettings";
import { PlayerState } from "./PlayerState";
import { RoundSession } from "./RoundSession";

export type GameStatus = "STARTING" | "STARTED" | "FINISHING" | "FINISHED";

export interface GameSession {
    id? : number;
    lobbySessionId? : number;
    gameStatus : GameStatus
    createdAt : string
    lastUpdatedAt : string
    players : Record<string, PlayerState>
    currentRound : RoundSession,
    rounds : RoundSession[],
    gameSettings : GameSettings

}