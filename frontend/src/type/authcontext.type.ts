export type User = {
    id: number
    username: string
    points: number
    role: string
}

export type AuthContextType = {
    user: User | null
    loginAndRedirect: (
        username: string,
        password: string,
        navigate: (path: string) => void
    ) => Promise<void>
    logout: (navigate: (path: string) => void) => Promise<void>
    loading: boolean
}