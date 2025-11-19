
export interface UserSession {
    userId : number;
    sessionId : string;
    displayName : string;
    lobbyId : number;
    lastPingTime : string;
    active : boolean;
    isSpectator : boolean;
}