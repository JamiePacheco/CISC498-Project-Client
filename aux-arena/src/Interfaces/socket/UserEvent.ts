
export type MessageStatus = "FAILED" | "SUCCESS";

export type UserEventType = "ROUND_UPDATE" | "LOBBY_UPDATE" | "CHAT_UPDATE" | "USER_UPDATE";

export interface UserEvent<T> {
    messageContent : T,
    messageStatus : MessageStatus,
    userEventType : UserEventType,
    message : string,
    errorMessage : string,
    sequence : number
}