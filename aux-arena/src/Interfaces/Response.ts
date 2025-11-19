interface HttpStatus {
    value : number,
    series : string,
    reasonPhrase : string
}

export interface Response<T> {
    status : HttpStatus,
    message : string,
    responseContent : T
}