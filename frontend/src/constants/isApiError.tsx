import type { ApiError, ApiErrorData } from "../type/signupmodal.type"

const isApiError = (err: unknown): err is ApiError => {
    return (
        typeof err === "object" &&
        err != null &&
        'response' in err &&
        typeof (err as any).response === "object"
    )
}

export const getErrorData = (err: unknown): ApiErrorData | null => {
    if (isApiError(err)) {
        return err.response?.data ?? null
    }
    return null
}