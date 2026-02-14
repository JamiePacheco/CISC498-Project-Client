import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../Types/User"

type Chat = {
    userID: number;
    message: string;
}

interface LobbyInfo {
    lobbyID: number;
    playerCap: number;
    userList: User[];
    usersByID: Record<number, User>; 
    numPlayer: number;
    chatLog: Chat[];
}

interface userScorePayload {
    userID: number;
    points: number;
}

export function updateChat(state: Chat[], newMessage: Chat): Chat[]{
    if(!newMessage.message.trim()) return state; // ignore empty messages){
    const newChat = [...state, newMessage];
    if(newChat.length > 50) {
        newChat.shift();
    }
    return newChat;
}

const initialState: LobbyInfo = {
    lobbyID: 1,
    playerCap: 10,
    userList: [],
    usersByID: {},//Not recommended to have both this and userList, but I have it for easier access for playerlist and chat
    numPlayer: 0,
    chatLog: [{userID:-1, message:"Testing"}]
}

const lobbySlice = createSlice({
    name: "lobby",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            if(state.numPlayer < state.playerCap && !state.usersByID[action.payload.userID]){
                state.usersByID[action.payload.userID] = action.payload;
                state.userList.push(action.payload);
                state.numPlayer++;
                state.chatLog = updateChat(state.chatLog, {userID: -1,
                    message:`Player: ${action.payload.displayName} has joined the lobby`
                });
                console.log("added player")
            }
        },removeUser: (state, action: PayloadAction<User>) => {
            const leavingUser = state.usersByID[action.payload.userID];
            if(!leavingUser) return;
            const num = state.userList.findIndex(u => u.userID === action.payload.userID);
            state.userList.splice(num, 1);
            delete state.usersByID[action.payload.userID];
            state.chatLog = updateChat(state.chatLog, {userID: -1,
                    message: `Player: ${leavingUser.displayName} has left the lobby`
            })
            state.numPlayer--;
        }, newMessage: (state, action: PayloadAction<Chat>) => {
            state.chatLog = updateChat(state.chatLog, action.payload);
        }, earnPoints: (state, action: PayloadAction<userScorePayload>) => {
            if(state.usersByID[action.payload.userID]){
                state.usersByID[action.payload.userID].score += action.payload.points;
                const num = state.userList.findIndex(u => u.userID === action.payload.userID);
                state.userList[num].score += action.payload.points;
            }
        },leaveLobby: () => initialState,
    }
})

export default lobbySlice.reducer;

export const { addUser, removeUser, newMessage, earnPoints, leaveLobby } = lobbySlice.actions;