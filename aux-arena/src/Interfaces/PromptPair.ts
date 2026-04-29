import { PlayerState } from "./PlayerState";
import { PromptSubmission } from "./PromptSubmission";
import { Vote } from "./vote";

export type PromptPairStatus = "WAITING_FOR_PLAYERS" | "WAITING_FOR_VOTES" | "RECEIVED_VOTES";

export interface Prompt {
    prompt : string,
    authorId : string,
    wasGenerated : boolean
}

export interface PromptPair {

    promptId : string,
    prompt : Prompt,
    players : PlayerState[],
    promptSubmissions : Record<string, PromptSubmission>,
    voteSubmissions: Vote[],
    promptPairStatus: PromptPairStatus
}