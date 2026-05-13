import { Response } from "../Interfaces/Response";
import api from "./AxiosInstance";

const GAME_URL = "/v1/youtube";

export async function searchMusic(query : string) {

    const res = await api.get<Response<any>>(
        GAME_URL,
        {
            params : {
                "query" : query
            }
        }
    )
    return res;
}