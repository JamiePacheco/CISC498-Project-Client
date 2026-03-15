import { Store } from "@reduxjs/toolkit";
import { lobbyEventReceived, userMessageReceived } from "../redux/slices/lobbySlice";

// parse incoming lobby event and change corresponding state in redux store
export const LOBBY_EVENT = (store : Store, event : any) => {
    store.dispatch(lobbyEventReceived(event));
}

// parse incoming lobby message and change corresponding state in redux store
export const LOBBY_MESSAGE = (store : Store, message : any) => {
    store.dispatch(userMessageReceived(message))
}

// paise incoming message SPECIFICALLY to some user
export const USER_UPDATE = (store : Store, message : any) => {
    store.dispatch(userMessageReceived(message));
}


export const serverEventMap: Record<string, Function> = {
  LOBBY_EVENT,
  LOBBY_MESSAGE
};

export const serverMessageMap : Record<string, Function> = {
    USER_UPDATE
}