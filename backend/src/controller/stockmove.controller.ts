import { Request, Response, NextFunction } from "express";

import {
    getAllStockmovementService,
    getStockmovementByIdService,
} from '../service/stockmove.service'
import { AppError } from "../util/AppError";


export const getAllStockmovement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1

        const { data, total } = await getAllStockmovementService(page)
        return res.status(200).json({ data, total })
    } catch (err) {
        return next(err)
    }
}

export const getStockmovementById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("Invalid id ", 400)
        }

        const data = await getStockmovementByIdService(id)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

