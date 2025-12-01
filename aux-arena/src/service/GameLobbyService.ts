import { GameLobby } from "../Interfaces/GameLobby";
import { LobbySession } from "../Interfaces/LobbySession";
import { LobbyUser } from "../Interfaces/LobbyUser";
import { Response } from "../Interfaces/Response";
import api from "./AxiosInstance";

const GAME_LOBBY_URL = '/v1/game-lobby';

export async function createNewGameLobby(gameLobby : GameLobby) {
    const res = await api.post<Response<GameLobby>>(
        GAME_LOBBY_URL,
        gameLobby
    )
    return res;
}

export async function getGameLobby(gameLobbyCode : string, password : string) {
    const res = await api.get<Response<GameLobby>>(
        GAME_LOBBY_URL,
        {
            params : {
                "lobby-id" : gameLobbyCode,
                "password" : password
            }
        }
    )
    return res
}
