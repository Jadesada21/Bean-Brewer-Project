import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../util/AppError'

import {
    getAllOrderService,
    createOrderService,
    cancelOrderService,
    getOrderByidService,
    getOrderDetailsByIdService,
    getAllOrderByLoginUserService,
    getOrderByIdByLoginUserService,
    createOrderFromCartService
} from '../../service/order/order.service'


import { Status } from '../../types/order.type'


export const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1

        const { data, total } = await getAllOrderService(page)
        return res.status(200).json({ data, total })
    } catch (err) {
        return next(err)
    }
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const data = await createOrderService(
            req.body,
            loginUserId
        )
        return res.status(201).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const cancelOrder = async (req: Request<{ id: string }, {}, { status: Status }>, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id)

        if (Number.isNaN(orderId)) {
            throw new AppError("Invalid orderid", 400)
        }

        const data = await cancelOrderService(orderId, req.user)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id)

        if (Number.isNaN(orderId)) {
            throw new AppError("Invalid order id", 400)
        }

        const data = await getOrderByidService(orderId)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const getOrderDetailsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id)

        if (Number.isNaN(orderId)) {
            throw new AppError("Invalid order id", 400)
        }

        const data = await getOrderDetailsByIdService(orderId)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const getAllOrderByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const data = await getAllOrderByLoginUserService(loginUserId)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const getOrderByIdByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id)
        const loginUserId = req.user!.id

        if (Number.isNaN(orderId)) {
            throw new AppError("Order not found", 400)
        }

        const data = await getOrderByIdByLoginUserService(orderId, loginUserId)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const createOrderFromCart = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const loginUserId = req.user!.id

        const order = await createOrderFromCartService(loginUserId)

        return res.status(201).json({ data: order })
    } catch (err) {
        return next(err)
    }
}