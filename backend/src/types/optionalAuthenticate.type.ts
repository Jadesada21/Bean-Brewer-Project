import { Role } from "./users.type"

export interface JwtPayload {
    id: number
    role: Role
}