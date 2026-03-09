import { Store } from "@reduxjs/toolkit";
import { lobbyEventRecieved, userMessageRecieved } from "../redux/slices/lobbySlice";

// parse incoming lobby event and change corresponding state in redux store
export const LOBBY_EVENT = (store : Store, event : any) => {
    store.dispatch(lobbyEventRecieved(event));
}

// parse incoming lobby message and change corresponding state in redux store
export const LOBBY_MESSAGE = (store : Store, message : any) => {
    store.dispatch(userMessageRecieved(message))
}

export const USER_UPDATE = (store : Store, message : any) => {
    store.dispatch(userMessageRecieved(message));
}


export const serverEventMap: Record<string, Function> = {
  LOBBY_EVENT,
  LOBBY_MESSAGE
};

export const serverMessageMap : Record<string, Function> = {
    USER_UPDATE
}