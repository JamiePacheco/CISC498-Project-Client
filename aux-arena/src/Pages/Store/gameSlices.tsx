
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { song } from "../Types/Game";
import { createPlayer, Player, User } from "../Types/User";

/**Game Phases:
 * - Prompt Phase: Players creates a prompt
 * - Picking Phase: Choosing a song (Only for participating players)
 * - Viewing Phase: Listening to song/ Waiting for songs to be chosen
 *       * Spectators start here watching players in two previous phases
 * - Voting Phase: Picking the song you like most/fits the theme best
 * - Winner Phase: Show winner*/
enum Phase {
    PROMPT,
    PICKING, 
    VIEWING1,
    VIEWING2,
    VOTING,
    WINNER
};

type gameState = {
    countDown: number; //Timestamp of end of current round, calc countdown locally
    prompt: string;
    gamePhase: Phase;
}

interface game {
    player1: Player;
    player2: Player;
    gameInfo: gameState;
}

const initialState: game = {
    player1: createPlayer(),
    player2: createPlayer(),
    gameInfo: {countDown: 10, prompt: "", gamePhase: 0}
}

interface playerAssign{
    playerInfo: User;
    playerNumber: number;
}

interface playerScoresPayload{
    player1Votes: number;
    player2Votes: number;
}

interface songSelectPayload{
    playerNumber: number;
    songInfo: song;
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setPlayer: (state, action:PayloadAction<playerAssign>)=>{
            if(action.payload.playerNumber === 1){
                state.player1.userInfo = action.payload.playerInfo;
            }else if(action.payload.playerNumber=== 2){
                state.player2.userInfo = action.payload.playerInfo;
            }
        },setPrompt: (state, action:PayloadAction<string>)=>{
            state.gameInfo.prompt = action.payload;
        },assignVotes: (state, action:PayloadAction<playerScoresPayload>)=>{
            state.player1.votes = action.payload.player1Votes;
            state.player2.votes = action.payload.player2Votes;
        },changePhase: (state)=> {
            const temp:number = state.gameInfo.gamePhase;
            state.gameInfo.gamePhase = (temp+1) % 6;
        },selectSong: (state, action:PayloadAction<songSelectPayload>)=>{
            if(action.payload.playerNumber === 1){
                state.player1.chosenSong = action.payload.songInfo;
            }else if(action.payload.playerNumber=== 2){
                state.player2.chosenSong = action.payload.songInfo;
            }
        },endGame: () => initialState
    }
})

export default gameSlice.reducer;

export const { setPlayer, setPrompt, assignVotes, selectSong, changePhase, endGame } = gameSlice.actions;