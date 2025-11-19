
export function authenticateUser(username : string, password : string) : string{
    let output = ""
    if(username && password)
        output = "logged in"
    return output
}

export function createGuestUser(username : string, gameLobbyCode : string, isAuthor : boolean) {

}