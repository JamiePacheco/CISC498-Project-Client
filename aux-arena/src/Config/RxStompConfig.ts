import { ReconnectionTimeMode, RxStompConfig } from "@stomp/rx-stomp";
import SockJS from "sockjs-client";

export const rxStompConfig : RxStompConfig = {
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"), //make this depend on evironmental variable,
    reconnectDelay: 2000,
    reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL
}