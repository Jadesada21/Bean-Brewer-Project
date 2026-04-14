import { PgError } from "../types/pgerror.type"


export const isPgError = (err: unknown): err is PgError => {
    return typeof err === "object" && err !== null && "code" in err
}