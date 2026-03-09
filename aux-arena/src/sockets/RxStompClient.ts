import { RxStomp } from "@stomp/rx-stomp";
import { rxStompConfig } from "../Config/RxStompConfig";

export const rxStomp = new RxStomp();
rxStomp.configure(rxStompConfig);

export const activeRxStomp = () => {
    if (!rxStomp.active) rxStomp.activate();
}

export const deactiveRxStomp = () => {
    if (rxStomp.active) rxStomp.deactivate();
}