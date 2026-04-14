export type onCloseProps = {
    onClose: () => void
}

export type ApiError = {
    response?: {
        data?: {
            message?: string
        }
    }
}

