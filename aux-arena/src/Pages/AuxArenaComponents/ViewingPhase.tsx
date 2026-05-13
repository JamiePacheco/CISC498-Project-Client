import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useEffect, useState } from "react";
import { PromptSubmission } from "../../Interfaces/PromptSubmission";


export default function ViewingPhase(){
    const game = useSelector((state:RootState)=> state.game);

    const roundSession = useSelector((state : RootState) => state.lobby.roundSession);
    const promptPairs = useSelector((state:RootState) => state.lobby.roundSession?.promptPairs);
    const currentPromptPair = useSelector((state:RootState) => state.lobby.roundSession?.currentPromptId);

    const [displaySubmission, setDisplaySubmission] = useState<PromptSubmission | undefined>(undefined);

    const [timer, setTimer] = useState(roundSession?.phaseDuration);

    if (promptPairs && currentPromptPair) console.log(promptPairs[currentPromptPair]);

    useEffect(() => {
        if (!roundSession || !timer || !promptPairs || !currentPromptPair) return;
        const interval = setInterval(() => {
            const promptPair = promptPairs[currentPromptPair];
            if (timer <= Math.floor(roundSession.phaseDuration / 2)) {
                setDisplaySubmission(promptPair.promptSubmissions[promptPair.players[0].userSessionId]);
            } else {
                setDisplaySubmission(promptPair.promptSubmissions[promptPair.players[1].userSessionId]);
            }
            setTimer(prev => { 
                if (prev === undefined) return prev
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval);
    }, [currentPromptPair, promptPairs, roundSession, timer])


    if (!displaySubmission || !promptPairs || !currentPromptPair) return <div> Need to finish implementing </div>


    return (
        <div>

            <div> {promptPairs[currentPromptPair].prompt.prompt} </div>

            {<div> Player: {}<div>
                <iframe id="ytplayer" width="640" height="360" title={displaySubmission.songChoice.title}
                    src={`https://www.youtube.com/embed/${displaySubmission.songChoice.videoUrl}?autoplay=1&start=${displaySubmission.songChoice.timestampStartAt}&end=${displaySubmission.songChoice.timestampEndAt}`}></iframe>
                </div>
            </div>}
        </div>
    )
}