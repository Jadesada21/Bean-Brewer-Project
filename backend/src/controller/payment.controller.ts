import { NextFunction, Request, Response } from "express";
import { AppError } from "../util/AppError";


import {
    getAllPaymentService,
    createPaymentService,
    updatePaymentStatusService,
    getPaymentByIdService,
    AdminGetPaymentDetailByIdService,
    AdminGetPaymentIdByService
} from '../service/payment.service'

import { PaymentUpdateStatus } from "../types/payment.type";


export const getAllPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllPaymentService()
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id)

        if (Number.isNaN(orderId)) {
            throw new AppError("Invalid orderId", 400)
        }

        const userId = req.user!.id


        const payment = await createPaymentService(orderId, userId)
        return res.status(201).json({ payment })
    } catch (err) {
        return next(err)
    }
}


export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentId = Number(req.params.id)
        const loginUserId = Number(req.user!.id)
        const role = req.user!.role

        if (Number.isNaN(paymentId)) {
            throw new AppError("Invalid payment id", 400)
        }

        const { status } = req.body

        const allowedStatuses: PaymentUpdateStatus[] = ["completed", "cancelled"]

        if (!allowedStatuses.includes(status)) {
            throw new AppError("Invalid payment status", 400)
        }

        if (!['completed', 'cancelled'].includes(status)) {
            throw new AppError("Invalid payment status", 400)
        }

        const data = await updatePaymentStatusService(paymentId, status, loginUserId, role)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}


export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentId = Number(req.params.id)

        if (Number.isNaN(paymentId)) {
            throw new AppError("Invalid paymentId", 400)
        }

        const data = await getPaymentByIdService(paymentId, req.user!.id)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const AdminGetPaymentDetailById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const paymentId = Number(req.params.id)

        if (Number.isNaN(paymentId)) {
            throw new AppError("Invalid paymentId", 400)
        }

        const data = await AdminGetPaymentDetailByIdService(paymentId)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const AdminGetPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("invalid Id", 400)
        }

        const data = await AdminGetPaymentIdByService(id)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}