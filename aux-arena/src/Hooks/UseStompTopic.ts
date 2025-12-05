import { useCallback, useEffect, useRef, useState } from "react";
import { rxStomp } from "../sockets/RxStompInstance";
import { rxStompConfig } from "../Config/RxStompConfig";
import { last } from "rxjs";

export interface SequencedEvent {
    sequence: number;
    [key : string] : any;
}

export function useStompTopic<T extends SequencedEvent>(
    topic: string,
    onEvent: (event : T) => void
) {
    const lastSequence = useRef<number>(0);
    const buffer = useRef<Map<number, T>>(new Map());
    const onEventRef = useRef(onEvent);

    onEventRef.current = onEvent;

    const tryFlush = useCallback(() => {
        while(buffer.current.has(lastSequence.current + 1)) {
            console.log("here")
            const nextSeq = lastSequence.current + 1;
            const event = buffer.current.get(nextSeq)!;
            console.log(event)

            buffer.current.delete(nextSeq);
            lastSequence.current = nextSeq;
            onEventRef.current(event);
        }
    }, []);

    useEffect(() => {
        if (!rxStomp.active) rxStomp.activate();

        const subscription = rxStomp.watch(topic).subscribe(msg => {
            const parsed : T = JSON.parse(msg.body);
            const seq = parsed.sequence;
            if (seq <= lastSequence.current) {
                console.log("somehow...")
                lastSequence.current = seq - 1;
                return;
            }
            console.log(`[${topic}] current: ${seq} last sequence: ${lastSequence.current}`)
            
            console.log(`1: ${lastSequence.current > 0}`)
            console.log(`2: ${seq > lastSequence.current + 1}`)

            console.log(`${parsed}`)

            if (lastSequence.current >= 0 && seq > lastSequence.current + 1) {
                lastSequence.current = seq - 1;
                console.log(`${topic} reset to ${lastSequence.current}`)
            }
            buffer.current.set(seq,parsed);
            tryFlush();
        });

        return () => subscription.unsubscribe();
    }, [topic, tryFlush]);
}


// a react hook that can be used for any STOMP topic
// export function useStompTopic<T = any>(topic : string) {
//     const [messages, setMessages] = useState<T[]>([]);
//     const queue = useRef<T[]>([]);
//     const processing = useRef(false);
//     const processQueue = useRef<() => void | null>(null);

//     processQueue.current = () => {
//         if (processing.current || queue.current.length === 0) return;
//         processing.current = true;

//         const msg = queue.current.shift();
//         if (msg) {
//             setMessages(prev => [...prev, msg]);
//             console.log(`processing queue: ${messages}`)
//         }

//         processing.current = false;

//         if (queue.current.length > 0) {
//             processQueue.current?.();
//         }
//     }


//     useEffect(() => {
//         // rxStomp.connected$.subscribe(() => {
//         //     console.log("CONNECTED")
//         // })

//         if (!rxStomp.active) rxStomp.activate();

//         const sub = rxStomp
//             .watch(topic)
//             .subscribe(msg => {
//                     const parsed = JSON.parse(msg.body);
//                     queue.current.push(parsed);
//                     processQueue.current?.();
//                 }
//             );

//             return () => sub.unsubscribe();
//     }, [topic]);

//     return messages;
// }

// export function useStompTopic<>(
//     topic: string,
//     onEvent: (event: T) => void
// ) {
//     const lastSequence = useRef<number>(0);
//     const buffer = useRef<Map<number, T>>(new Map());

//     const tryFlush = useCallback(() => {
//         while (buffer.current.has(lastSequence.current + 1)) {
//             const nextSeq = lastSequence.current + 1;
//             const evt = buffer.current.get(nextSeq)!;
//             buffer.current.delete(nextSeq);
//             lastSequence.current = nextSeq;
//             onEvent(evt);
//         }
//     }, [onEvent]);

//     useEffect(() => {
//         if (!rxStomp.active) rxStomp.activate();

//         const subscription = rxStomp.watch(topic).subscribe(msg => {
//             const parsed: T = JSON.parse(msg.body);

//             const seq = parsed.sequence;
//             if (seq <= lastSequence.current) {
//                 // ignore duplicates or late arrivals
//                 return;
//             }

//             buffer.current.set(seq, parsed);
//             tryFlush();
//         });

//         return () => subscription.unsubscribe();
//     }, [topic, tryFlush]);
// }
