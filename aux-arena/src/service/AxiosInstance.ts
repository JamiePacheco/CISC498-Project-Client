import axios from "axios";

const api = axios.create(
    {
        baseURL: "http://localhost:8080/api", // make this variable based on env variable
        withCredentials: true
    }
)

export default api