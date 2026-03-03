import { LobbySession } from "../Interfaces/LobbySession";
import { LobbyUser } from "../Interfaces/LobbyUser";
import { Response } from "../Interfaces/Response";
import api from "./AxiosInstance";

const LOBBY_SESSION_URL = "/v1/lobby-session";

export async function connectToGameLobby(gameLobbyCode : string, password : string, tempId : string, user : LobbyUser) {
    const res = await api.post<Response<LobbySession>>(
        LOBBY_SESSION_URL + "/connect",
        user,
        {
            params : {
                "lobby-code" : gameLobbyCode,
                "password" : password,
                "temp-id" : tempId
            }
        }
    )
    return res;
}