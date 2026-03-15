import { Middleware, PayloadAction, UnknownAction } from "@reduxjs/toolkit";
import { activeRxStomp } from "../sockets/RxStompClient";
import { socketCommandMap } from "../sockets/SocketMessageService";
import { subscribeLobby, subscribeMessages, subscribeUser } from "../sockets/SocketSubscriptions";

function isReduxAction(action: unknown): action is UnknownAction {
  return typeof action === "object" && action !== null && "type" in action;
}

export const rxStompMiddleware : Middleware = store => next => action => {


    if (isReduxAction(action)) {
        const result = next(action);

        const state = store.getState().lobby;

        activeRxStomp();

        const handler = socketCommandMap[action.type];

        if (handler) {
            console.log(action.payload)
            handler(action.payload);
        }
        if (state.lobbySession && state.lobbySession.id) {
            console.log("we are subscribing")
            subscribeLobby(store, state.lobbySession.id);
            subscribeMessages(store, state.lobbySession.id);
            subscribeUser(store, state.lobbySession.id);
        }
        return result;
    }
}