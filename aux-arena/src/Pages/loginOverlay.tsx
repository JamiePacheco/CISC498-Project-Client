import { useState } from 'react';
import './overlay.css'
import { authenticateUser } from '../service/AuthenticationService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './Store/store';
import { login } from './Store/userSlices';


export interface login{
    setLoggingIn: (isLoggingIn:boolean)=>void;//For closing overlay
}

type mode = "Login" | "Register" | "Reset"; // 1: Login, 2: Register, 3: Reset

export default function LoginOverlay({setLoggingIn}: login){
    const dispatch = useDispatch<AppDispatch>();//Used to access store
    const [loginMode, setMode] = useState<mode>("Login"); //Changing between login "modes"
    const [password, setPassword] = useState<string>("")//Temporary password holder
    const [nameInput, setInput] = useState<string>("");//Temporary username holder
    const [email, setEmail] = useState<string>("");//Temporary email holder

    function changePassword(event:any){ //Just to store password and send to database to compare
        setPassword(event.target.value);
    }function setName(event:any){ //Temporarily stores name, clicking login will set it for real
        setInput(event.target.value);
    }function changeEmail(event:any){
        setEmail(event.target.value);
    }

    function loggingIn(){
        // Add proper authentication
        dispatch(login({
            userInfo: {userID: 1, displayName: nameInput, isReady: false, isSpectator: false, score: 0},
            sessionID: 1,
            lastPingTime: new Date(),
            lobbyID: 1}
        ));
        setLoggingIn(false)
    }
    
    /*
    function register(){
        //Function for registering account, requires communication with server
    }
    */

    return(
        <div className={`${loginMode}`==="Register" ? "overlay register" : "overlay"}>
            <div className="exit" onClick={()=>setLoggingIn(false)}>x</div>
            {loginMode === "Login" && <div>
                <b>Login</b>
                <div className="input">
                    Username:
                    <div>
                        <input className="text-box" type="text" onChange={setName}></input>
                    </div>
                </div>
                <div className="input">
                    Password: 
                    <div>
                        <input className="text-box" type="password" onChange={changePassword}></input>
                    </div>
                </div>
                <small className='forgot-password' onClick={()=>setMode('Reset')}>Forgot Login |</small>
                <small className='forgot-password' onClick={()=>setMode('Register')}> Register</small>
                <button className="enter lobby-button" onClick={loggingIn}>{`${loginMode}`}</button>
            </div>}
            {loginMode === "Register" && <div>
                <b>Register</b>
                <div className="input">
                    Username:
                    <div>
                        <input className="text-box" type="text" onChange={setName}></input>
                    </div>
                </div>
                <div className="input">
                    Password:
                    <div>
                        <input className="text-box" type="password" onChange={changePassword}></input>
                    </div>
                </div>
                <div className='input'>
                    Email Address:
                    <div>
                        <input className="text-box" type="text"></input>
                    </div>
                </div>
                <small className='forgot-password' onClick={()=>setMode('Login')}> Login</small>
                <button className="enter lobby-button">{`${loginMode}`}</button>
            </div>}
            {loginMode === "Reset" && <div>
                <b>Resetting Password</b>
                <div className="input">
                    Email Address:
                    <div>
                        <input className="text-box" type="text" onChange={changeEmail}></input>
                    </div>
                </div>
                <button className='lobby-button'>Send Code</button>
                <div className="input">
                    Password:
                    <div>
                        <input className="text-box" disabled={true} type="password" onChange={changePassword}></input>
                    </div>
                </div>
                <small className='forgot-password' onClick={()=>setMode('Reset')}>Forgot Login |</small>
                <small className='forgot-password' onClick={()=>setMode('Register')}> Register</small>
            </div>}
        </div>
    )
}