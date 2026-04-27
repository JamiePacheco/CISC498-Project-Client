import { useEffect, useRef, useState } from "react"
import { UserEvent } from "../Interfaces/socket/UserEvent";
import {Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface UseStompProps {
    url : string;
    topics : string[];
    onMessage: (msg : IMessage, topic : string) => void;
}

export const useStompClient = ({url, topics, onMessage} : UseStompProps) => {
    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<StompSubscription[]>([]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(url),
            reconnectDelay: 3000,
            debug: () => {},
        });

        client.onConnect = () => {
            console.log("STOMP: connected");

            subscriptionsRef.current = topics.map((topic) => {
                return client.subscribe(topic, (msg) => onMessage(msg, topic))
            });
        };

        client.onStompError = (frame) => {
            console.error("Broker error: ", frame.headers["message"])
        };

        client.activate()
        clientRef.current = client;

        return () => {
            console.log("STOMP: Disconnecting...");
            subscriptionsRef.current.forEach((sub) => sub.unsubscribe())
            client.deactivate();
        };

    }, [url, JSON.stringify(topics)]);

    const sendMessage = (destination : string, body : any) => {
        clientRef.current?.publish({
            destination,
            body : JSON.stringify(body)
        });
    };

    return {sendMessage};
}