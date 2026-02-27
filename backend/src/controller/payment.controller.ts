import { NextFunction, Request, Response } from "express";
import { AppError } from "../util/AppError";


import {
    createPaymentService
} from '../service/payment.service'


export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.orderId)
        const userId = req.user!.id
        const { paymentResult } = req.body

        const payment = await createPaymentService(orderId, userId)
        return res.status(200).json({ status: "Success", data: payment })
    } catch (err) {
        next(err)
    }
}