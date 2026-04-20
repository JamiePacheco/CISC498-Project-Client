import { Middleware, PayloadAction, UnknownAction } from "@reduxjs/toolkit";
import { activeRxStomp, deactiveRxStomp } from "../sockets/RxStompClient";
import { socketCommandMap } from "../sockets/SocketMessageService";
import { subscribeLobby, subscribeMessages, subscribeUser } from "../sockets/SocketSubscriptions";
import { LobbyConnectionState } from "./slices/lobbySlice";

function isReduxAction(action: unknown): action is UnknownAction {
  return typeof action === "object" && action !== null && "type" in action;
}

let subscribed = false;

export const rxStompMiddleware : Middleware = store => next => action => {

    console.log("Middleware Activating")
    console.log(action)
    const result = next(action);
    if (isReduxAction(action) && action.type.startsWith('lobby/')) {

        const state = store.getState().lobby;

        console.log("Store");
        console.log(state)

        if (action.type === "lobby/closeConnection") {
            subscribed = false;
            deactiveRxStomp();
            return result;
        }

        if (action.type === "lobby/resetConnection") {
            subscribed = false;
            deactiveRxStomp();
        }

        if (!state.lobbySession) return;
        
        activeRxStomp();

        const handler = socketCommandMap[action.type];
        console.log(handler)

        if (handler) {
            console.log(action.payload)
            handler(action.payload);
        }
        if (state.lobbySession && state.lobbySession.id && !subscribed) {
            console.log(`we are subscribing to ${state.lobbySession.id} gamelobby socket`)
            subscribeLobby(store, state.lobbySession.id);
            subscribeMessages(store, state.lobbySession.id);
            subscribeUser(store, state.lobbySession.id);
            subscribed = true
        }
    }
    return result;
}