import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameLobbyEvent, MessageEvent } from "../../Interfaces/socket/GameLobbyEvent";
import { UserSession } from "../../Interfaces/UserSession";
import { Message } from "../../Interfaces/socket/Message";
import { GameLobbyMessage } from "../../Interfaces/socket/GameLobbyMessage";
import { LobbySession } from "../../Interfaces/LobbySession";

export interface LobbyConnectionState {
    lobbyId: number | null;
    lobbySession?: LobbySession;
    userSession?: UserSession;
    users: UserSession[];
    chat: GameLobbyMessage[];
    lastSequence: number;
}

const initialState: LobbyConnectionState = {
    lobbyId: null,
    lobbySession: undefined,
    userSession: undefined,
    users: [],
    chat: [],
    lastSequence: 0,
};

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
        },

        // UI intent
        sendMessage(state, action: PayloadAction<{lobbyId : number, gameLobbyMessage : GameLobbyMessage}>) {
            // middleware sends socket message
        },

        lobbyEventReceived(state, action: PayloadAction<GameLobbyEvent<any>>) {
            const event = action.payload;

            if (event.sequence <= state.lastSequence) return;
            state.lastSequence = event.sequence;
            console.log("lobby event parsing")
            switch (event.type) {
                case MessageEvent.USER_JOINED:
                    console.log(event)
                    if (state.userSession && state.userSession.tempId !== event.payload.tempId) {
                        state.users.push(event.payload);
                    }
                    break;

                case MessageEvent.NEW_HOST:
                    if (state.lobbySession) {
                        state.lobbySession.host = event.payload;
                        state.lobbySession.activeUsers[event.payload.tempId].host = true;

                        const newHostIndex = state.users.findIndex((u : UserSession) => u.tempId === event.payload.tempId);
                        state.users[newHostIndex].host = true;
                    }
                    break;

                case MessageEvent.USER_LEFT:
                    state.users = state.users.filter(
                        user => user.tempId !== event.payload.tempId
                    );
                    break;

                case MessageEvent.USER_CLEANUP:
                    const removedIds = new Set(
                        event.payload.map((u: UserSession) => u.tempId)
                    );

                    state.users = state.users.filter(
                        u => !removedIds.has(u.tempId)
                    );
                    break;
            }
        },

        lobbyMessageReceived(state, action: PayloadAction<GameLobbyMessage>) {
            console.log("lobby message received")
            state.chat.push(action.payload);
        },

        userMessageReceived(state, action: PayloadAction<Message<any>>) {
            console.log("user message received")
            const message = action.payload;

            if (message.messageStatus !== "SUCCESS") return;

            switch (message.messageType) {
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
            }
        }
    }
});

export const {
    joinLobby,
    sendMessage,
    lobbyEventReceived,
    lobbyMessageReceived,
    userMessageReceived
} = lobbySlice.actions;

export default lobbySlice.reducer;