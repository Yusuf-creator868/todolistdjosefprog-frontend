import axios from 'axios'

export const localhost = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: localhost
}
)

export default api