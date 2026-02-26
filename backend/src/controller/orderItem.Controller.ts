import { NextFunction, Request, Response } from 'express'
import { AppError } from '../util/AppError'

import {
    getAllOrderItemService,
    getOrderItemByOrderIdService
} from '../service/orderItems.service'

export const getAllOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await getAllOrderItemService()
        return res.status(200).json({ status: "Success", data: response })
    } catch (err) {
        next(err)
    }
}

export const getOrderItemByOrderId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.orderId)

        if (Number.isNaN(orderId)) {
            return res.status(400).json({ status: "Failed", message: "Invalid order id" })
        }

        const response = await getOrderItemByOrderIdService(orderId)
        return res.status(200).json({ status: "Success", data: response })
    } catch (err) {
        next(err)
    }
}