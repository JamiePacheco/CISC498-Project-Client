
import { useEffect, useState } from "react";
import gear from "../../Images/gear.png"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function LobbySettings(){
    const user = useSelector((state:RootState)=> state.user);
    const lobby = useSelector((state:RootState)=> state.lobby);
    //To keep track of whether the settings are open or not
    const [menu, openMenu] = useState<boolean>(false);
    //You can remove these next few
    const [numRounds, setNumRounds] = useState<number>(1);
    const [isTimed, setTimed] = useState<boolean>(false);
    const [timerList, setList] = useState<number[]>([30, 30, 30, 30, 30, 30]);
    const [isHost, setHost] = useState<boolean>(false);
    
    useEffect(()=>{
            for(const lobbyUser of lobby.users){
                if(lobbyUser.userId === user.userInfo.userID){
                    setHost(true);
                }
            }
        }
    ,[lobby, user.userInfo.userID])


    function timerHelper(phaseNum:number, setNum: number){
        if(!isHost) return;
        const newList = [...timerList];
        newList[phaseNum] = setNum;
        setList(newList);
    }

    return (
        <div>
            <div className="Settings">Settings</div>
            <img alt="Setting Gear" src={gear} className="gear" onClick={()=>{openMenu(!menu)}}></img>
            {menu && <div className="overlay menu pixel-corners" style={{paddingTop: "5%"}}>
                <div className="scroll">
                    Number of Rounds: {numRounds}
                    <br></br>
                    <input className="slider" type="range" min="1" max="10" value={numRounds} onChange={(e)=>setNumRounds(Number(e.target.value))}
                    disabled={isHost? true : false}/>
                    <br></br>
                    Toggle Round Timer: 
                    <label className="switch" onClick={()=>setTimed(!isTimed)}>
                        <input type="range"
                        className={isTimed? " small-slider" : "false"} min="1" max="2" value={isTimed? 1 : 2}
                        disabled={isHost? true : false}></input>
                    </label>
                    {isTimed && 
                    <div style={{paddingTop:"1em"}}>
                        Prompt Phase Timer: {timerList[0]} Seconds
                        <br></br>
                        <input className="slider" type="range" min="30" max="90" value={timerList[0]} onChange={(e)=>timerHelper(0, Number(e.target.value))}
                        disabled={isHost? true : false}/>
                        <br></br>
                        Picking Phase Timer: {timerList[1]} Seconds
                        <br></br>
                        <input className="slider" type="range" min="30" max="90" value={timerList[1]} onChange={(e)=>timerHelper(1, Number(e.target.value))}
                        disabled={isHost? true : false}/>
                        <br></br>
                        Viewing1 Phase Timer: {timerList[2]} Seconds
                        <br></br>
                        <input className="slider" type="range" min="30" max="90" value={timerList[2]} onChange={(e)=>timerHelper(2, Number(e.target.value))}
                        disabled={isHost? true : false}/>
                        <br></br>
                        Viewing2 Phase Timer: {timerList[3]} Seconds
                        <br></br>
                        <input className="slider" type="range" min="30" max="90" value={timerList[3]} onChange={(e)=>timerHelper(3, Number(e.target.value))}
                        disabled={isHost? true : false}/>
                        <br></br>
                        Voting Phase Timer: {timerList[4]} Seconds
                        <br></br>
                        <input className="slider" type="range" min="30" max="90" value={timerList[4]} onChange={(e)=>timerHelper(4, Number(e.target.value))}
                        disabled={isHost? true : false}/>
                        <br></br>
                        Winner Phase Timer: {timerList[5]} Seconds
                        <br></br>
                        <input className="slider" type="range" min="30" max="90" value={timerList[5]} onChange={(e)=>timerHelper(5, Number(e.target.value))}
                        disabled={isHost? true : false}/>
                </div>
                }
                </div>
            </div>}
        </div>
    )
}