import { GameLobby } from "./GameLobby";
import { User } from "./User";

export type LobbyUserRole = "GUEST" | "REGULAR"

export interface LobbyUser {
    gamelobby? : GameLobby;
    user? : User,
    guestIdentifier? : string,
    nickname : string,
    joinedAt? : string,
    lastSocketConnectionId? : string,
    isSpectator : boolean,
    host? : boolean,
    role : LobbyUserRole
}