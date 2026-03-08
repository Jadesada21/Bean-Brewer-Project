import { api } from "../AxiosInstance";


export const loginApi = async (username: string, password: string) => {
    const res = await api.post('/login', {
        username,
        password
    })

    return res.data
}