
export type GameMode = "PROMPT_BATTLE" | "PLAYLIST_BATTLE";

export interface GameSettings {
    gameMode : GameMode;
    timed : boolean;
    maxDisplayTime : number;
    rounds : number;
}