import { Middleware } from "@reduxjs/toolkit";
import { LobbyAction } from "../../redux/actions/LobbyActions";
import { ensureSocketConnection, rxStomp } from "./SocketService";

let lobbySubscription : any = null;

export const socketMiddleware : Middleware = (store) => (next) => (action) => {
    const handler = socketAcitonHandlers[action.type];

    if (handler) {
        handler(store, action);
    }

    return next(action);
}