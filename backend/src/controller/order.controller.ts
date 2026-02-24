import { NextFunction, Request, Response } from 'express'
import { AppError } from '../util/AppError'

import {
    getAllOrderService,
    createOrderService,
    updateStatusOrderService,
    getOrderByidService,
    getOrderByUserIdService
} from '../service/order.service'

import { CreateOrderInput } from '../types/order.type'
import { Status } from '../types/order.type'


export const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await getAllOrderService()
        return res.status(200).json({ status: "Success", data: response })
    } catch (err) {
        next(err)
    }
}

export const createOrder = async (req: Request<{ id: string }, {}, CreateOrderInput>, res: Response, next: NextFunction) => {
    try {

        const user_id = req.user?.id
        const { items } = req.body

        if (!user_id) {
            throw new AppError("Unauthorized", 400)
        }

        if (!Array.isArray(items) || items.length === 0) {
            throw new AppError("Order items required", 400)
        }

        const response = await createOrderService({
            user_id,
            items
        })
        return res.status(200).json({ status: "Success", data: response })
    } catch (err) {
        next(err)
    }
}

export const updateStatusOrder = async (req: Request<{ id: string }, {}, { status: Status }>, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id)
        const { status } = req.body


        if (!isNaN(orderId)) {
            return res.status(400).json({ status: "Failed", message: "Invalid order id" })
        }

        if (!status) {
            return res.status(400).json({ status: "Failed", message: "Status is required" })
        }

        const allowedStatus: Status[] = ["completed", "cancelled"]

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ status: "Failed", message: "Invalid Status" })
        }

        const response = await updateStatusOrderService(orderId, status, req.user)
        return res.status(200).json({ status: "Success", data: response.message })
    } catch (err) {
        next(err)
    }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            return res.status(400).json({ status: "Failed", message: "Invalid order id" })
        }

        const response = await getOrderByidService(id)
        return res.status(200).json({ status: "Success", data: response })
    } catch (err) {
        next(err)
    }
}

export const getOrderByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.id)

        if (Number.isNaN(userId) || userId < 0) {
            return res.status(400).json({ status: "Failed", message: "Invalid user id" })
        }

        const response = await getOrderByUserIdService(userId)
        return res.status(200).json({ status: "Success", data: response })
    } catch (err) {
        next(err)
    }
}