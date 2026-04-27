import { NextFunction, Request, Response } from 'express'

import { createUsersService } from '../service/register.service'

import { RegisterInput } from '../Schemas/register.schema'


export const createUsers = async (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) => {
    try {
        const newCustomer = await createUsersService(req.body)
        return res.status(201).json({ newCustomer })
    } catch (err) {
        next(err)
    }
}