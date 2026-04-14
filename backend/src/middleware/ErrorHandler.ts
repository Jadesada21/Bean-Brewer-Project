import { Request, Response, NextFunction } from "express"
import { AppError } from "../util/AppError"
import { DB_CONSTRAINT_EXISTING } from "../constants/statusCode"
import { isPgError } from "../constants/isPgError"

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    let error: unknown = err

    if (isPgError(err) && err.code === '23505') {
        if (err.constraint === DB_CONSTRAINT_EXISTING.USER_EMAIL) {
            error = new AppError("Email already exists", 400)
        }

        if (err.constraint === DB_CONSTRAINT_EXISTING.USER_USERNAME) {
            error = new AppError("Username already exists", 400)
        }
    }

    const statusCode = err instanceof AppError ? err.statusCode : 500
    const message = err instanceof AppError ? err.message : "Internal server error"


    return res.status(statusCode).json({
        statusCode,
        message
    })
}
