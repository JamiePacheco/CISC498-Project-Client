
export function authenticateUser(username : string, password : string) : string{
    let output = ""
    if(username && password)
        output = "logged in"
    return output
}