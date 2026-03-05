import { RxStomp } from "@stomp/rx-stomp";
import { rxStompConfig } from "../Config/RxStompConfig";

export const rxStomp = new RxStomp();
rxStomp.configure(rxStompConfig);