import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameLobbyEvent } from "../../Interfaces/socket/GameLobbyEvent";
import { UserSession } from "../../Interfaces/UserSession";

export interface LobbyConnectionState {
    connectionState : "idle" | "connecting" | "connected" | "error";
    userSession : UserSession | null
}

export interface ActionPayload<T> {
    gameLobbyId : number;
    payloadData? : T;
}

const initialLobbyConnectionState : LobbyConnectionState = {
    connectionState : "idle",
    userSession : null
}

const lobbySlice = createSlice(
    {
        name : "lobby",
        initialState : initialLobbyConnectionState,
        reducers : {
            joinLobby(state, action : PayloadAction<ActionPayload<string>>) {
                


            },
            lobbyEventRecieved(state, action : PayloadAction<ActionPayload<GameLobbyEvent<any>>>) {


            }
        }
    }
)

export const {
    joinLobby,
    lobbyEventRecieved
} = lobbySlice.actions;