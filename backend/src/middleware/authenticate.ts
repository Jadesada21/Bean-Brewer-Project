import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "../util/AppError"

import { Role } from "../types/users.type"
import { JwtPayload } from "../types/optionalAuthenticate.type"



export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token

        if (!token) {
            throw new AppError("Unauthorize", 401)
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload

        req.user = {
            id: decoded.id,
            role: decoded.role
        }
        next()
    } catch (err) {
        next(new AppError("Invalid token", 401))
    }
}