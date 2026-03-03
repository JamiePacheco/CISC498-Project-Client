
export type MessageStatus = "FAILED" | "SUCCESS";

export type MessageType = "ROUND_UPDATE" | "LOBBY_UPDATE" | "CHAT_UPDATE" | "USER_UPDATE";

export interface Message<T> {
    messageContent : T,
    messageStatus : MessageStatus,
    messageType : MessageType,
    message : string,
    errorMessage : string,
    sequence : number
}