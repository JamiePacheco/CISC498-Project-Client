import { Store } from "@reduxjs/toolkit";
import { ensureSocketConnection } from "../../service/connection-middleware/SocketService";
import { rxStomp } from "../../sockets/RxStompClient";
import { UserSession } from "../../Interfaces/UserSession";
import { GameLobbyMessage } from "../../Interfaces/socket/GameLobbyMessage";

export const joinLobby = async (lobbyId : number, newUserSession : UserSession) => {
    const dest = `/app/game-lobby/join/${lobbyId}`;
    rxStomp.publish({
        destination: dest,
        body: JSON.stringify(newUserSession)

    });
};

export const sendMessage = async (lobbyId : number, userMessage : GameLobbyMessage) => {
    rxStomp.publish({
        destination: `/app/game-lobby/send-message/${lobbyId}`,
        body: JSON.stringify(userMessage)
    });
};