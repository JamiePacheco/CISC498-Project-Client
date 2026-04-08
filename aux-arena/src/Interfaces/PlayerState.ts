import { PromptSubmission } from "./PromptSubmission";

export interface PlayerState {
    userId : number,
    userSessionId : string,
    score : number,
    ready : boolean,
    isSpectator : boolean,
    promptSubmissions : PromptSubmission[]
}