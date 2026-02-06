import axios from 'axios'

export const localhost = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: localhost
}
)

export default api