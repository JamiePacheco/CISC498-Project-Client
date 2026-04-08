import { lobbyEventReceived, lobbyMessageReceived, userMessageReceived } from "../redux/slices/lobbySlice"
import { rxStomp } from "./RxStompClient"

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
      
      store.dispatch(lobbyEventReceived(event));
    })
}

export function subscribeMessages(store:any, lobbyId:number) {

  if (messageSubscription) messageSubscription.unsubscribe()
  messageSubscription = rxStomp
    .watch(`/topic/game-lobby/message/${lobbyId}`)
    .subscribe(msg => {

      const message = JSON.parse(msg.body)
      console.log(message)
      
      store.dispatch(lobbyMessageReceived(message.payload))
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

      store.dispatch(userMessageReceived(message))
    })

}