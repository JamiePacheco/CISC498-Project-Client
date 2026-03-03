import { User } from "../Interfaces/User";
import api from "./AxiosInstance"

const AUTH_URL = "/v1/auth"

export function authenticateUser(username : string, password : string){
    const res = api.get(
        AUTH_URL,
        {
            params : {
                "username" : username,
                "password" : password
            }
        }
    );
    return res;
}

export function createNewUser(newUserDetails : User) {
    const res = api.post(
        AUTH_URL,
        newUserDetails
    )
    return res;
}

export function createGuestUser(username : string, gameLobbyCode : string, isAuthor : boolean) {
    const res = api.post(
        AUTH_URL + "/guest",
        null,
        {
            params : {
                "username" : username,
                "game-lobby-code" : gameLobbyCode,
                "isAuthor" : isAuthor
            }
        }
    );
    return res;
}