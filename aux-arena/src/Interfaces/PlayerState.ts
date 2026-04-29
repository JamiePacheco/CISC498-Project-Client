import { PromptSubmission } from "./PromptSubmission";
import { VoteSubmission } from "./VoteSubmission";

export interface PlayerState {
    userId : number,
    userSessionId : string,
    score : number,
    ready : boolean,
    isSpectator : boolean,
    promptSubmissions : PromptSubmission[]
    voteSubmissions : VoteSubmission[]
}