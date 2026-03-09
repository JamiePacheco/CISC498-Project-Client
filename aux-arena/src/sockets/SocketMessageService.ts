import { GameLobbyMessage } from "../Interfaces/socket/GameLobbyMessage";
import { UserSession } from "../Interfaces/UserSession";
import { rxStomp } from "./RxStompClient";

// generic send message function to specified socket endpoint
function sendMessage(destination : string, body : any) {
    console.log(`Sending message: ${JSON.stringify(body)}`)
    rxStomp.publish({
        destination,
        body : JSON.stringify(body),
    });
}

// send new chat message to some specified lobby
export function sendChatMessage(lobbyId : number, newMessage : GameLobbyMessage) {
    sendMessage(`/app/game-lobby/send-message/${lobbyId}`, newMessage);
}

// send new user information to some specified lobby
export function sendUserSessionMessage(lobbyId : number, newUserSession : UserSession) {
    sendMessage(`/app/game-lobby/join/${lobbyId}`, newUserSession);
}

export const socketCommandMap : Record<string, Function> = {
    "lobby/joinLobby" : sendUserSessionMessage,
    "lobby/sendMessage" : sendChatMessage
}