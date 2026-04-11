import { NextFunction, Request, Response } from 'express'
import { getDashboardService } from '../service/dashboard.service'

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getDashboardService()
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}