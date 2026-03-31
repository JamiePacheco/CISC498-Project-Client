import { UserSession } from "../Interfaces/UserSession"
import { rxStomp } from "./RxStompClient"
import { LOBBY_EVENT, serverEventMap } from "./SocketEvents"

let lobbySubscription:any
let messageSubscription:any
let userSubscription:any

export function subscribeLobby(store:any, lobbyId:number) {

  if (lobbySubscription) lobbySubscription.unsubscribe()
  lobbySubscription = rxStomp
    .watch(`/topic/game-lobby/${lobbyId}`)
    .subscribe(msg => {
      console.log("Got a message")
      const event = JSON.parse(msg.body)
      console.log(event)
      const handler = serverEventMap["LOBBY_EVENT"]

      if (handler) handler(store, event)

    })
}

export function subscribeMessages(store:any, lobbyId:number) {

  if (messageSubscription) messageSubscription.unsubscribe()
  messageSubscription = rxStomp
    .watch(`/topic/game-lobby/message/${lobbyId}`)
    .subscribe(msg => {

      const message = JSON.parse(msg.body)
      console.log(message)
      store.dispatch({
        type:"lobby/lobbyMessageReceived",
        payload:  message.payload
      })

    })

}

export function subscribeUser(store:any, lobbyId:number) {

  if (userSubscription) userSubscription.unsubscribe()
  
  userSubscription = rxStomp
    .watch(`/user/queue/game-lobby/${lobbyId}`)
    .subscribe(msg => {

      const message = JSON.parse(msg.body)
      console.log(`[/user/queue/game-lobby/${lobbyId}] Message:`)
      console.log(message)

      store.dispatch({
        type:"lobby/userMessageReceived",
        payload: message
      })

    })

}