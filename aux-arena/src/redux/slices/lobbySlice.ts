import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameLobbyEvent, MessageEvent } from "../../Interfaces/socket/GameLobbyEvent";
import { UserSession } from "../../Interfaces/UserSession";
import { Message } from "../../Interfaces/socket/Message";
import { GameLobbyMessage } from "../../Interfaces/socket/GameLobbyMessage";
import { LobbySession } from "../../Interfaces/LobbySession";

export interface LobbyConnectionState {
    lobbyId : number;
    lobbySession : LobbySession | undefined,
    userSession : UserSession | undefined,
    users : UserSession[],
    chat : GameLobbyMessage[],
    lastSequence : number;
}

export interface ActionPayload<T> {
    gameLobbyId : number;
    payloadData? : T;
}

const initialLobbyConnectionState : LobbyConnectionState = {
    lobbyId : -1,
    lobbySession : undefined,
    userSession : undefined,
    users : [],
    chat : [],
    lastSequence : 0,
}

const lobbySlice = createSlice(
    {
        name : "lobby",
        initialState : initialLobbyConnectionState,
        // add any and all functions related to changing the state of the game lobby here
        reducers : {
            // only want to change the lobby session info 
            joinLobby(state, action : PayloadAction<ActionPayload<{gameLobbySession : LobbySession}>>) {
                state.lobbySession = action.payload.payloadData?.gameLobbySession;
                if (!state.lobbySession || !action.payload.payloadData?.gameLobbySession.id) return;
                state.lobbyId = action.payload.payloadData?.gameLobbySession.id
            },
            sendMessage(state, action : PayloadAction<ActionPayload<GameLobbyMessage>>) {},
            // parse the incomming socket message
            lobbyEventRecieved(state, action : PayloadAction<ActionPayload<GameLobbyEvent<any>>>) {
                const event = action.payload.payloadData;
                if (event === undefined) return;
                
                // TODO implement proper sequence handling to ensure events are in proper order
                if (event.sequence <= state.lastSequence) return;
                state.lastSequence = event.sequence;

                // logic depends on event type
                switch(event.type) {
                    case MessageEvent.USER_JOINED:
                        state.users.push(event.payload);
                        break;
                    case MessageEvent.NEW_HOST:
                        if (!state.lobbySession?.host) break; 
                        state.lobbySession.host = event.payload;
                        break;
                    case MessageEvent.USER_LEFT:
                        state.users = state.users.filter((user) => user.tempId !== event.payload.tempId);
                        break;
                    case MessageEvent.USER_CLEANUP:
                        const removedUsers : string[] = event.payload.map((u : UserSession) => u.tempId);
                        state.users = state.users.filter((u) => !removedUsers.includes(u.tempId))
                        break;
                }

            },
            // add recieved messages to the current state
            lobbyMessageRecieved(state, action : PayloadAction<ActionPayload<GameLobbyMessage>>) {
                if (!action.payload.payloadData) return; 
                state.chat.push(action.payload.payloadData)
            },
            // handle the socket messages sent specifcally to the user
            userMessageRecieved(state, action : PayloadAction<ActionPayload<Message<any>>>) {
                if (!action.payload.payloadData?.messageContent) return;

                const message : Message<UserSession> = action.payload.payloadData;
                
                if (message?.messageStatus === "SUCCESS") {
                    switch(message.messageType) {
                        case "USER_UPDATE":
                            state.userSession = message.messageContent;
                    }
                }
            }            
        }
    }
)

export const {
    joinLobby,
    sendMessage,
    lobbyEventRecieved,
    lobbyMessageRecieved,
    userMessageRecieved
} = lobbySlice.actions;

export default lobbySlice.reducer;