import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


export default function PlayerReadyCount() {

    const players = useSelector((state:RootState) => state.lobby.gameSession?.players);

    return (
        <div>
            {players && 
                <span> 
                    {`Players Ready: 
                    ${Object.values(players).filter(p => !p.isSpectator && p.ready).length} 
                    / 
                    ${Object.values(players).filter(p => !p.isSpectator).length}`} 
                </span>
            }
        </div>
    )

}