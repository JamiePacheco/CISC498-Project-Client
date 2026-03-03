import { GameLobbyEvent } from "../../Interfaces/socket/GameLobbyEvent";
import { useStompTopic } from "../UseStompTopic";

export function useGameLobbyEvents<T>(gameLobbyId : string, onEvent : (event : GameLobbyEvent<T>) => void) {
    return useStompTopic(`/topic/game-lobby/${gameLobbyId}`, onEvent);
}