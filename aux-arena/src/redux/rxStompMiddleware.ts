import { Middleware } from "@reduxjs/toolkit";
import { socketCommandMap } from "../sockets/SocketMessageService";
import { activeRxStomp, rxStomp } from "../sockets/RxStompClient";
import { LobbyConnectionState } from "./slices/lobbySlice";
import { serverEventMap, serverMessageMap } from "../sockets/SocketEvents";
import { Message } from "../Interfaces/socket/Message";

export const rxStompMiddleware : Middleware = (store) => {

    let lobbySubscribed = false;
    let userSubscribed = false;
    let messageSubscribed = false;

    return next => action  => {
        const handler = socketCommandMap[action.type];
        if (handler) {
            activeRxStomp()
            handler(action.payload);
        }

        const state : LobbyConnectionState = store.getState();

        if (!lobbySubscribed && state.lobbySession) {
            rxStomp
                .watch(`/topic/game-lobby/${state.lobbySession.id}`)
                .subscribe(msg => {
                    const event = JSON.parse(msg.body);
                    const serverHandler = serverEventMap[event.type];
                    if (serverHandler) serverHandler(store, event);
                });
            lobbySubscribed = true;
        }

        if (!userSubscribed && state.userSession) {
            rxStomp
                .watch(`/queue/${state.userSession.userId}`)
                .subscribe(msg => {
                    const message : Message<any> = JSON.parse(msg.body);
                    const userHandler = serverMessageMap[message.messageType]
                    if (userHandler) userHandler(store, message);
                })
            userSubscribed = true;
        }

        if (!messageSubscribed && state.lobbySession) {
            rxStomp
                .watch(`/topic/game-lobby/message/${state.lobbySession.id}`)
                .subscribe(msg => {
                    const message = JSON.parse(msg.body);
                    const handler = serverEventMap["LOBBY_MESSAGE"];
                    if (handler) handler(store, message);
                });

            messageSubscribed = true;
        }
        

        return next(action);
    }

}