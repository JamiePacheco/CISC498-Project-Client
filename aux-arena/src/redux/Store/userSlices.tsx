import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, MainUser, createMainUser } from "../../Pages/Types/User"

type UserState = MainUser;

const initialState: UserState = createMainUser();

interface loginPayload {
    userInfo: User;
    sessionID: number;
    lobbyID: number;
    lastPingTime: string;
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
            console.log("Logging in");
        },
        enterLobby: (state, action: PayloadAction<lobbyPayload>) => {
            state.lobbyID = action.payload.lobbyID;
        },
        logout: () => {createMainUser();
            console.log("Logging Out");
        }
    }
});

export default userSlice.reducer;

export const { login, enterLobby, logout } = userSlice.actions;