
export enum MessageEvent {
    USER_JOINED = 'USER_JOINED',
    USER_LEFT = 'USER_LEFT',
    USER_CLEANUP = 'USER_CLEANUP',
    LOBBY_UPDATED = 'LOBBY_UPDATED',
    NEW_HOST = 'NEW_HOST',
    NEW_MESSAGE = 'NEW_MESSAGE'
    // GAME_STARTED,
    // GAME_ENDED,
    // SCORE_UPDATES,
    // ROUND_STARTED,
    // PROMPT_ASSIGNED,
    // SUBMISSION_RECEIVED,
    // VOTE_UPDATES,
}

export interface GameLobbyEvent<T> {
    type : MessageEvent,
    message : string,
    payload : T,
    timestamp : string,
    sequence : number
}