import { NextFunction, Request, Response } from "express";
import { AppError } from "../util/AppError";

import {
    getAllPointsHistoryService,
    AdminGetPointsHistoryByUserIdService,
    getPointsHistoryByUserIdService
} from '../service/pointHistory.service'


export const getAllPointsHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId
            ? Number(req.query.userId)
            : undefined

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 20

        if (userId && isNaN(userId)) {
            throw new AppError("Invalid UserId", 400)
        }

        if (isNaN(limit)) {
            throw new AppError("Invalid limit", 400)
        }

        const data = await getAllPointsHistoryService(userId, limit)
        return res.status(200).json({ total: data.length })

    } catch (err) {
        next(err)
    }
}

export const AdminGetPointsHistoryByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const targetUserId = Number(req.params.userId)

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 10

        if (isNaN(targetUserId)) {
            throw new AppError("Invalid UserId", 400)
        }

        if (isNaN(limit)) {
            throw new AppError("Invalid limit", 400)
        }

        const data = await AdminGetPointsHistoryByUserIdService(targetUserId, limit)
        return res.status(200).json({ total: data.length })
    } catch (err) {
        next(err)
    }
}


export const getMyPointsHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const page = Number(req.query.page) || 1

        const { data, total } = await getPointsHistoryByUserIdService(loginUserId, page)
        return res.status(200).json({ data, total })
    } catch (err) {
        next(err)
    }
}