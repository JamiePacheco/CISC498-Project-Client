import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, MainUser, createMainUser } from "../Types/User"

type UserState = MainUser;

const initialState: UserState = createMainUser();

interface loginPayload {
    userInfo: User;
    sessionID: number;
    lobbyID: number;
    lastPingTime: Date;
}

interface lobbyPayload {
    sessionID: number,
    lobbyID: number
};

const userSlice = createSlice({
    name: "user", 
    initialState,
    reducers: {
        login: (state, action: PayloadAction<loginPayload>) => {
            Object.assign(state, action.payload);
            state.loggedIn = true;
        },
        enterLobby: (state, action: PayloadAction<lobbyPayload>) => {
            state.sessionID = action.payload.sessionID;
            state.lobbyID = action.payload.lobbyID;
        },
        logout: () => createMainUser()
    }
});

export default userSlice.reducer;

export const { login, enterLobby, logout } = userSlice.actions;