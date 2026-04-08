
export interface UserSession {
    userId? : number;
    tempId : string;
    sessionId : string;
    displayName : string;
    lobbyId : number;
    lobbyCode : string;
    active : boolean;
    isSpectator : boolean;
    host: boolean;
}