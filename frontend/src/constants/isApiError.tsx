import type { ApiError } from "../type/signupmodal.type"

export const isApiError = (err: unknown): err is ApiError => {
    return typeof err === "object" && err != null && 'response' in err
}