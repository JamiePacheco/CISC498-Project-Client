import { rxStomp } from "./RxStompInstance";

// body should eventually have an explicit type of the list of all possible socket bodies but this shall wait...
export function sendMessage(destination : string, body : any) {

    console.log("Sending message")

    rxStomp.publish({
        destination,
        body : JSON.stringify(body),
    });
}