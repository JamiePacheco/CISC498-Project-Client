import { GameSettings } from "../Interfaces/GameSettings";
import { LobbySession } from "../Interfaces/LobbySession";
import { Prompt } from "../Interfaces/PromptPair";
import { PromptSubmission } from "../Interfaces/PromptSubmission";
import { GameLobbyMessage } from "../Interfaces/socket/GameLobbyMessage";
import { UserSession } from "../Interfaces/UserSession";
import { rxStomp } from "./RxStompClient";

// generic send message function to specified socket endpoint
function sendMessage(destination : string, body : any) {
    console.log(`Sending message: ${JSON.stringify(body)}`)
    rxStomp.publish({
        destination: destination,
        body : JSON.stringify(body),
    });
}

// send new chat message to some specified lobby
export function sendChatMessage({lobbyId, gameLobbyMessage}: {lobbyId : number, gameLobbyMessage : GameLobbyMessage}) {
    console.log("Chat Message")
    console.log(gameLobbyMessage)
    sendMessage(`/app/game-lobby/send-message/${lobbyId}`, gameLobbyMessage);
}

// send new user information to some specified lobby
export function sendUserSessionMessage({gameLobby, userSessionDetails} : {gameLobby : LobbySession, userSessionDetails : UserSession}) {
    sendMessage(`/app/game-lobby/join/${gameLobby.id}`, userSessionDetails);
}

export function startGameSession({gameLobby, gameSettings} : {gameLobby : LobbySession, gameSettings : GameSettings}) {
    console.log("Starting Game Session")
    sendMessage(`/app/game-lobby/start-game/${gameLobby.id}`, gameSettings)
}

export function sendPrompt({gameLobby, prompt} : {gameLobby : LobbySession, prompt : Prompt}) {
    console.log("Sending Prompt")
    sendMessage(`/app/game-lobby/submit-prompt/${gameLobby.id}`, prompt);
}

export function sendSong({gameLobby, promptSubmission} : {gameLobby : LobbySession, promptSubmission : PromptSubmission}) {
        sendMessage(`/app/game-lobby/submit-song/${gameLobby.id}`, promptSubmission);
}

export const socketCommandMap : Record<string, Function> = {
    "lobby/joinLobby" : sendUserSessionMessage,
    "lobby/sendMessage" : sendChatMessage,
    "lobby/startGameSession" : startGameSession,
    "lobby/sendPrompt" : sendPrompt,
    "lobby/sendSong" : sendSong,
}