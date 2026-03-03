import axios from "axios";

const api = axios.create(
    {
        baseURL: "http://localhost:8080/api", // make this variable based on env variable
        withCredentials: true
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    window.location.href = '/'
            }
        }
    }
)


export default api