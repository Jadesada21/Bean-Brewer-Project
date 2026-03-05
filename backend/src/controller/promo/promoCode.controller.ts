import { NextFunction, Request, Response } from 'express'

import {
    getAllPromoCodeService,
    createPromoCodeService,
    getPromoCodeByIdService,
    togglePromoCodeActiveService
} from '../../service/promo/promoCode.service'

import {
    PromoCodeTypeInput
} from '../../types/promo.type'
import { AppError } from '../../util/AppError'



export const getAllPromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllPromoCodeService()
        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}

export const createPromoCode = async (req: Request<{}, {}, PromoCodeTypeInput>, res: Response, next: NextFunction) => {
    try {
        const { code, bonus_points, max_usage } = req.body

        if (
            code == null ||
            bonus_points == null ||
            max_usage == null
        ) {
            throw new AppError("Missing required field", 400)
        }

        if (
            typeof code !== "string" ||
            code.trim() === "" ||

            typeof bonus_points !== "number" || !Number.isInteger(bonus_points) ||
            bonus_points <= 0 ||

            typeof max_usage !== "number" || !Number.isInteger(max_usage) ||
            max_usage <= 0
        ) {
            throw new AppError("Invalid input", 400)
        }

        const newPromoCode = await createPromoCodeService(req.body)
        return res.status(201).json({ status: "Success", newPromoCode })

    } catch (err) {
        next(err)
    }
}

export const getPromoCodeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            throw new AppError("Invalid product ID", 400)
        }

        const data = await getPromoCodeByIdService(id)
        return res.status(200).json({ status: "Success", data })

    } catch (err) {
        next(err)
    }
}

export const togglePromoCodeActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) {
            throw new AppError("Invalid Promo Code id", 400)
        }
        const data = await togglePromoCodeActiveService(id)
        return res.status(200).json({ status: "Success", data })

    } catch (err) {
        next(err)
    }
}