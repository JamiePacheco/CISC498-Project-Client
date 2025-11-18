import { useState } from 'react';
import './overlay.css'
import { authenticateUser } from '../service/AuthenticationService';


export interface login{
    username: string;
    setUsername: (name:string)=>void;
    setLoggedIn: (isLoggedIn:string)=>void;
    setLoggingIn: (isLoggingIn:boolean)=>void;
}

type mode = "Login" | "Register" | "Reset"; // 1: Login, 2: Register, 3: Reset

export default function LoginOverlay({username, setUsername, setLoggingIn, setLoggedIn}: login){
    const [loginMode, setMode] = useState<mode>("Login");
    const [password, setPassword] = useState<string>("")

    function changeName(event:any){
        setUsername(event.target.value);
    }

    function changePassword(event:any){ //Just to store password and send to database to compare
        setPassword(event.target.value);
    }

    function loggingIn(){
        if(authenticateUser(username, password))//Change to use the real authenticateUser later on
        {
            setLoggedIn("true")
            setLoggingIn(false)
        }
    }

    /*function compare(){//Compare values, be it password or code
        //Call database
    }*/

    return(
        <div className={`${loginMode}`==="Register" ? "overlay register" : "overlay"}>
            <div className="exit" onClick={()=>setLoggingIn(false)}>x</div>
            {loginMode === "Login" && <div>
                <b>Login</b>
                <div className="input">
                    Username:
                    <div>
                        <input className="text-box" type="text" onChange={changeName}></input>
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
                        <input className="text-box" type="text" defaultValue={username} onChange={changeName}></input>
                    </div>
                </div>
                <div className="input">
                    Password:
                    <div>
                        <input className="text-box" type="password"></input>
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
                        <input className="text-box" type="text" onChange={changeName}></input>
                    </div>
                </div>
                <button className='lobby-button'>Send Code</button>
                <div className="input">
                    Password:
                    <div>
                        <input className="text-box" disabled={true} type="password"></input>
                    </div>
                </div>
                <small className='forgot-password' onClick={()=>setMode('Reset')}>Forgot Login |</small>
                <small className='forgot-password' onClick={()=>setMode('Register')}> Register</small>
            </div>}
        </div>
    )
}