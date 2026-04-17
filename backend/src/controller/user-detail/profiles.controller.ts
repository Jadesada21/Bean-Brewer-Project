import { NextFunction, Request, Response } from 'express'
import {
    getAllPaymentByLoginUserService,
    getProfileByLoginUserService,
} from '../../service/user-details/profiles.service'


export const getUserByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const user = await getProfileByLoginUserService(loginUserId)
        return res.status(200).json({ status: "Success", user })
    } catch (err) {
        next(err)
    }
}

export const getAllPaymentByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const page = Number(req.query.page) || 1

        const { data, total } = await getAllPaymentByLoginUserService(loginUserId, page)
        return res.status(200).json({ data, total })
    } catch (err) {
        next(err)
    }
}

