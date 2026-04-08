import { PlayerState } from "./PlayerState";

export interface Vote {
    voter : PlayerState,
    promptPairId : string,
    submissionAuthorId : string
}