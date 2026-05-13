import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameLobbyEvent, MessageEvent } from "../../Interfaces/socket/GameLobbyEvent";
import { UserSession } from "../../Interfaces/UserSession";
import { UserEvent } from "../../Interfaces/socket/UserEvent";
import { GameLobbyMessage } from "../../Interfaces/socket/GameLobbyMessage";
import { LobbySession } from "../../Interfaces/LobbySession";
import { GameSession } from "../../Interfaces/GameSession";
import { RoundSession } from "../../Interfaces/RoundSession";
import { GameSettings } from "../../Interfaces/GameSettings";
import { Prompt, PromptPair } from "../../Interfaces/PromptPair";
import { PromptSubmission } from "../../Interfaces/PromptSubmission";

export interface LobbyConnectionState {
    lobbyId: number | null;
    lobbySession?: LobbySession;
    gameSession? : GameSession;
    roundSession? : RoundSession;
    userSession?: UserSession;
    users: UserSession[];
    chat: GameLobbyMessage[];
    lastSequence: number;
    socketPackets: GameLobbyEvent<any>[]; // debugging purposes, used to check what packets have been sent to the user
    assignedPrompts : PromptPair[];
}

const initialState: LobbyConnectionState = {
    lobbyId: null,
    lobbySession: undefined,
    userSession: undefined,
    gameSession: undefined,
    roundSession: undefined,
    users: [],
    chat: [],
    socketPackets: [],
    assignedPrompts: [],
    lastSequence: 0,
};

/* TODO 
    - Implement all needed models into the respective folders (also double check properties and make sure they are the same)
    - Implement gameSession and roundSession into redux state
    - Implement Start Game and make sure gameSession loads and is sent to all users (have basic test of all properties)
    - Make it so phasechange changes the component in AuxArena.tsx
*/
const lobbySlice = createSlice({
    name: "lobby",
    initialState,
    reducers: {

        // we define userSessionDetails to be used in middleware socket request
        joinLobby(state, action: PayloadAction<{gameLobby : LobbySession, userSessionDetails : UserSession}>) {
            // the game lobby is fetched using a normal HTTP request during user join
           
            state.lobbySession = action.payload.gameLobby;
            state.users = Object.values(action.payload.gameLobby.activeUsers);
            state.chat = action.payload.gameLobby.messages

            console.log("State after user joined")
            console.log(state)
        },

        // UI intent
        sendMessage(state, action: PayloadAction<{lobbyId : number, gameLobbyMessage : GameLobbyMessage}>) {
            // middleware sends socket message
        },
        startGameSession(state, action: PayloadAction<{gameLobby : LobbySession, gameSettings : GameSettings}>) {
            // middleware will handle sending socket request
        },
        sendPrompt(state, action : PayloadAction<{gameLobby : LobbySession, prompt : Prompt}>) {

        },
        sendSong(state, action: PayloadAction<{gameLobby : LobbySession, promptSubmission : PromptSubmission}>) {

        },
        lobbyEventReceived(state, action: PayloadAction<GameLobbyEvent<any>>) {
            const event = action.payload;

            console.log(`Event Receieved: ${event.type}`)
            console.log(event)

            state.socketPackets.push(event);

            if (event.sequence <= state.lastSequence) return;
            state.lastSequence = event.sequence;
            console.log("lobby event parsing")
            switch (event.type) {
                case MessageEvent.USER_JOINED:    
                    console.log("Updating user list to add new user")
                    const userIndex = state.users.findIndex((u : UserSession) => u.tempId === event.payload.tempId);
                    if (userIndex !== -1) {
                        state.users[userIndex] = event.payload;
                    } else if (state.userSession && state.userSession.tempId !== event.payload.tempId) {
                        state.users.push(event.payload);
                    }
                    break;

                case MessageEvent.NEW_HOST:
                    if (state.lobbySession && state.userSession) {
                        state.lobbySession.host = event.payload;
                        state.lobbySession.activeUsers[event.payload.tempId].host = true;

                        const newHostIndex = state.users.findIndex((u : UserSession) => u.tempId === event.payload.tempId);
                        state.users[newHostIndex].host = true;

                        // if (state.users[newHostIndex].tempId === state.userSession.tempId) {
                        //     state.userSession.host = true;
                        // }
                    }
                    break;

                case MessageEvent.USER_LEFT:
                    const disconnectedUser = event.payload;
                    const disconnectedUserIndex = state.users.findIndex((u) => u.tempId === disconnectedUser.tempId);
                    state.users[disconnectedUserIndex] = disconnectedUser; 

                    break;

                case MessageEvent.USER_CLEANUP:
                    const removedIds = new Set(
                        event.payload.map((u: UserSession) => u.tempId)
                    );

                    state.users = state.users.filter(
                        u => !removedIds.has(u.tempId)
                    );
                    break;
                case MessageEvent.GAME_STARTED:
                    state.gameSession = event.payload.gameSession;
                    if (state.lobbySession) {
                        state.lobbySession.status = event.payload.lobbyStatus;
                        state.lobbySession.lastUpdated = event.payload.lastUpdated;
                    }

                    if (state.gameSession?.currentRound) {
                        state.roundSession = state.gameSession.currentRound;
                    }

                    
                    break;    
                case MessageEvent.PHASE_CHANGE:
                    if (state.roundSession && state.gameSession) {
                        state.roundSession.roundStatus = event.payload.roundStatus;
                        state.roundSession.phaseDuration = event.payload.phaseDuration;
                        state.gameSession.lastUpdatedAt = event.timestamp;

                        // reset players ready status (only acts as visual indicator on each phase screen)
                        Object.keys(state.gameSession.players).forEach((id : string) => {
                                if (state.gameSession) state.gameSession.players[id].ready = false
                            }
                        )
                    }
                    break;
                case MessageEvent.PROMPT_SUBMITTED:
                    if (state.roundSession && state.gameSession) {
                        console.log("Prompt Submitted")
                        const userPrompt = event.payload
                        state.gameSession.players[userPrompt.authorId].ready = true;
                    }
                    break;
                case MessageEvent.SUBMISSION_RECEIVED:
                    if (state.roundSession && state.gameSession) {
                        console.log("Song Submission Receieved")
                        state.gameSession.players[event.payload].ready = true;
                    }
                    break;
                case MessageEvent.DISPLAY_PROMPT:
                    if (state.roundSession && state.gameSession) {

                        const promptPair : PromptPair = event.payload;

                        state.roundSession.promptPairs[promptPair.promptId] = promptPair;
                        state.roundSession.currentPromptId = promptPair.promptId;
                    }
            }
        },
        lobbyMessageReceived(state, action: PayloadAction<GameLobbyMessage>) {
            console.log("lobby message received")
            state.chat.push(action.payload);
        },

        userMessageReceived(state, action: PayloadAction<UserEvent<any>>) {
            console.log("user message received")
            const message = action.payload;

            if (message.messageStatus !== "SUCCESS") return;

            switch (message.userEventType) {
                case "USER_UPDATE":
                    // make sure all instances of Java instance are converted to string
                    
                    const userSession : UserSession = message.messageContent;
                    
                    console.log("Updating user state")

                    // update user session state
                    state.userSession = userSession;   

                    // update the embeded user record in lobby session state
                    if (state.lobbySession) {
                        state.lobbySession.activeUsers[userSession.tempId] = userSession;
                    }

                    // update the user list state

                    const userIndex = state.users.findIndex(u => {
                        return u.tempId === userSession.tempId;
                    })
                    console.log(userIndex)
                    
                    if (userIndex === -1) state.users.push(userSession);
                    else state.users[userIndex] = userSession
                    break;
                case "PROMPT_ASSIGNED":
                    if (state.gameSession && state.userSession) {
                        state.assignedPrompts.push(message.messageContent);
                    }
            }
        },
        resetConnection: () => {
            // console.log("resetting to inital state")
            // return initialState
        },
        closeConnection: () => {
            return initialState;
        }
    }
});

export const {
    joinLobby,
    sendMessage,
    startGameSession,
    sendPrompt,
    sendSong,

    lobbyEventReceived,
    lobbyMessageReceived,
    userMessageReceived,
    resetConnection,
    closeConnection,
} = lobbySlice.actions;

export default lobbySlice.reducer;