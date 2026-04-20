import { Response } from "../Interfaces/Response";
import api from "./AxiosInstance";

const GAME_URL = "/v1/youtube";

export async function searchMusic(query : string) {
    const res = await api.post<Response<string>>(
        GAME_URL,
        query
    )
    return res;
}