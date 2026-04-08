import { PlayerState } from "./PlayerState";
import { PromptSubmission } from "./PromptSubmission";
import { Vote } from "./vote";

export type PromptPairStatus = "WAITING_FOR_PLAYERS" | "WAITING_FOR_VOTES" | "RECEIVED_VOTES";

export interface Prompt {
    prompt : string,
    authorId : string
}

export interface PromptPair {

    promptId : string,
    prompt : Prompt,
    playerList : PlayerState[],
    promptSubmissions : Record<string, PromptSubmission>,
    votes: Vote[],
    promptPairStatus: PromptPairStatus
}