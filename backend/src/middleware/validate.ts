import { Request, Response, NextFunction } from 'express'
import { ZodType, ZodError } from 'zod'
import { AppError } from '../util/AppError'

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body)
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                return next(new AppError(err.issues[0].message, 400))
            }
            next(err)
        }
    }
}