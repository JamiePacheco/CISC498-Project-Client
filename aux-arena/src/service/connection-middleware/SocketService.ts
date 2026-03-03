import { ReconnectionTimeMode, RxStomp, RxStompConfig } from "@stomp/rx-stomp";
import SockJS from "sockjs-client";

// define rxStomp socket connection details
export const rxStompConfig : RxStompConfig = {
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"), //make this depend on evironmental variable,
    reconnectDelay: 2000,
    reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL
}

export const rxStomp = new RxStomp();

// track connection state
let connecting = false;

rxStomp.configure(rxStompConfig);

// connect to the base socket endpoint
export function ensureSocketConnection() : Promise<void> {
    // prevent restablishing connection or race-condition based connection
    if (rxStomp.active || connecting) return Promise.resolve();

    connecting = true;

    return new Promise((resolve) => {
        rxStomp.connected$.subscribe(() => {
            connecting = false;
            resolve();
        });
        rxStomp.activate();
    })
}

// disconnect from the socket endpoint explicitly
export function disconnect() {
    if (rxStomp.active) {
        rxStomp.deactivate();
    }
}