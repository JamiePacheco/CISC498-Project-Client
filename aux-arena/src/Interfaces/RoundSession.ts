import { PromptPair } from "./PromptPair";

export enum RoundStatus {
    WRITING_PROMPT,
    CHOOSING_SONG,
    PRESENTING,
    VOTING,
    SCORING,
    WAITING,
}


export interface RoundSession {
    roundId : number,
    roundStatus : RoundStatus,
    promptPairs : Record<string, PromptPair>
}