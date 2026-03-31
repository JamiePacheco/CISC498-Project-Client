import { RxStomp } from "@stomp/rx-stomp";
import { rxStompConfig } from "../Config/RxStompConfig";

export const rxStomp = new RxStomp();
rxStomp.configure(rxStompConfig);

export const activeRxStomp = () => {
    if (!rxStomp.active) {
        console.log(`Activating Socket Connection with JWT [${document.cookie}]`)
        rxStomp.activate();
    }
}

export const deactiveRxStomp = () => {
    console.log("Deactivating RxStomp Socket Connection")
    if (rxStomp.active) {
        console.log("Socket Connection Closed")
        rxStomp.deactivate();
    }
}

export const resetRxStomp = () => {
    deactiveRxStomp();
    activeRxStomp();
}