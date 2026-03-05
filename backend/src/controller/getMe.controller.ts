import { NextFunction, Request, Response } from 'express'
import { getUserByIdService } from '../service/getMe.service'

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const user = await getUserByIdService(loginUserId)
        return res.status(200).json({ status: "Success", user })
    } catch (err) {
        next(err)
    }
}

