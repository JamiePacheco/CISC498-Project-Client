import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlices"
import lobbyReducer from "./lobbySlices"
import gameReducer from "./gameSlices"

export const store = configureStore({
    reducer: {
        user: userReducer,
        lobby: lobbyReducer,
        game: gameReducer
    },
});

// helpful types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;

