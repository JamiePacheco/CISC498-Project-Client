
export interface SongChoice {
    videoUrl : string,
    title : string,
    thumbnail : string,
    timestampStartAt : number,
    timestampEndAt : number,
}

export interface PromptSubmission {
    songChoice : SongChoice,
    promptPairId : string,
    submittedAt : string
}