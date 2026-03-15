import { rxStomp } from "./RxStompClient"
import { serverEventMap } from "./SocketEvents"

let lobbySubscription:any
let messageSubscription:any
let userSubscription:any

export function subscribeLobby(store:any, lobbyId:number) {

  if (lobbySubscription) lobbySubscription.unsubscribe()

  console.log("subscribing to game lobby")

  lobbySubscription = rxStomp
    .watch(`/topic/game-lobby/${lobbyId}`)
    .subscribe(msg => {

      const event = JSON.parse(msg.body)
      const handler = serverEventMap[event.type]

      if (handler) handler(store, event)

    })

}

export function subscribeMessages(store:any, lobbyId:number) {

  if (messageSubscription) messageSubscription.unsubscribe()

  console.log("subscribing to messaging")

  messageSubscription = rxStomp
    .watch(`/topic/game-lobby/message/${lobbyId}`)
    .subscribe(msg => {

      const message = JSON.parse(msg.body)

      store.dispatch({
        type:"lobby/lobbyMessageReceived",
        payload:  message
      })

    })

}

export function subscribeUser(store:any, lobbyId:number) {

  if (userSubscription) userSubscription.unsubscribe()
  
  console.log("subscribing to user")

  userSubscription = rxStomp
    .watch(`/user/queue/game-lobby/${lobbyId}`)
    .subscribe(msg => {

      const message = JSON.parse(msg.body)
      console.log(message)
      store.dispatch({
        type:"lobby/userMessageReceived",
        payload: message
      })

    })

}