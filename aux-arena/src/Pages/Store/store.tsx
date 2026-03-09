import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlices"
import lobbyReducer from "../../redux/slices/lobbySlice"
import gameReducer from "./gameSlices"
import { rxStompMiddleware } from "../../redux/rxStompMiddleware";

export const store = configureStore({
    reducer: {
        user: userReducer,
        lobby: lobbyReducer,
        game: gameReducer
    },
    middleware : getDefaultMiddleware => 
        getDefaultMiddleware().concat(rxStompMiddleware)
});

// helpful types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;

