import { NextFunction, Request, Response } from "express";
import { AppError } from "../../util/AppError";

import {
    getAllRedeemService,
    createRedeemService,
    updateStatusRedeemService,
    getMyRedeemHistoryService,
    getRedeemByUserIdService,
    adminGetRedeemByIdService
} from '../../service/redeem/redeem.service'

import { RedeemUpdateStatus } from "../../types/redeem.type";

export const getAllRedeem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllRedeemService()
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }

}

export const createRedeem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const data = await createRedeemService(
            req.body,
            loginUserId
        )
        return res.status(201).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const updateStatusRedeem = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const redeemId = Number(req.params.id)
        const loginUserId = Number(req.user!.id)
        const role = req.user!.role


        if (Number.isNaN(redeemId)) {
            throw new AppError("Invalid redeemId", 400)
        }

        const { status } = req.body

        const allowedStatuses: RedeemUpdateStatus[] = ["completed", "failed"]

        if (!allowedStatuses.includes(status)) {
            throw new AppError("Invalid redeem status", 400)
        }

        if (!['completed', 'failed'].includes(status)) {
            throw new AppError("Invalid redeem status", 400)
        }

        const data = await updateStatusRedeemService(redeemId, status, loginUserId, role)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const getMyRedeemHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const data = await getMyRedeemHistoryService(loginUserId)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}

export const getRedeemByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId)

        if (Number.isNaN(userId) || userId <= 0) {
            throw new AppError("Invalid user id ", 400)
        }

        const data = await getRedeemByUserIdService(userId)
        return res.status(200).json({ status: "Success", data: data })
    }
    catch (err) {
        next(err)
    }
}


export const adminGetRedeemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const redeemId = Number(req.params.id)

        if (Number.isNaN(redeemId)) {
            throw new AppError("Invalid redeem id", 400)
        }

        const data = await adminGetRedeemByIdService(redeemId)
        return res.status(200).json({ status: "Success", data: data })
    } catch (err) {
        next(err)
    }
}