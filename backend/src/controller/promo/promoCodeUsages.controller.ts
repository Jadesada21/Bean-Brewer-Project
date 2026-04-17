import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../util/AppError'

import {
    getAllPromoCodeUsageByLoginUserService,
    redeemPromoCodeService,
    getAllRedeemedPromoCodeusagesService,
    getRedeemedPromoCodeusagesByIdService
} from '../../service/promo/promoCodeUsages.service'

// user route
export const getAllPromoCodeUsageByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = Number(req.user!.id)

        const page = Number(req.query.page) || 1

        const { data, total } = await getAllPromoCodeUsageByLoginUserService(loginUserId, page)
        return res.status(200).json({ data, total })
    } catch (err) {
        next(err)
    }
}

// user route
export const redeemPromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body

        if (!code || typeof code !== "string") {
            throw new AppError("Promo code is required", 400)
        }

        const normalizedCode = code.trim().toUpperCase()

        if (!normalizedCode) {
            throw new AppError("Promo code cannot be emthy", 400)
        }
        const loginUserId = Number(req.user!.id)

        const data = await redeemPromoCodeService(normalizedCode, loginUserId)
        return res.status(200).json({ status: "Success", message: data.message, earned_points: data.earned_points })
    } catch (err) {
        next(err)
    }
}

// admin route
export const getAllRedeemedPromoCodeusages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllRedeemedPromoCodeusagesService()
        return res.status(200).json({ data })

    } catch (err) {
        next(err)
    }
}

// admin route
export const getRedeemedPromoCodeusagesById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("Invalid Promo code usage id", 400)
        }

        const data = await getRedeemedPromoCodeusagesByIdService(id)
        return res.status(200).json({ data })

    } catch (err) {
        next(err)
    }
}

