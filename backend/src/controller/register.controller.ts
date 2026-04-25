import { NextFunction, Request, Response } from 'express'
import { AppError } from '../util/AppError'

import { CreateUsersInput } from "../types/users.type"


import { createUsersService } from '../service/register.service'


export const createUsers = async (req: Request<{}, {}, CreateUsersInput>, res: Response, next: NextFunction) => {
    try {

        const { username, password, email, first_name, last_name, phone_num } = req.body

        // required field
        if (!username || !password || !email || !first_name || !last_name || !phone_num) {
            throw new AppError("Missing required field", 400)
        }

        // username 4-40 char alphanumeric
        if (!/^[a-zA-Z0-9]{4,40}$/.test(username)) {
            throw new AppError("Username must be 3 to 40 characters (letter , number , underscore only", 400)
        }

        // email format
        if (!/^[^\s@]+@[^\@]+\.[^\s@]+$/.test(email)) {
            throw new AppError("Invalid email format", 400)
        }

        // password minimun
        if (password.length < 8) {
            throw new AppError("Password must be at least 8 characters", 400)
        }

        // condition of password
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            throw new AppError("Password must contain at least one letter and one number", 400)
        }

        const cleanPhone = phone_num.replace(/-/g, "")
        if (!/^\d{10}$/.test(cleanPhone)) {
            throw new AppError("Phone number must be 10 digits", 400)
        }

        // firstname validate only letter
        if (!/^[a-zA-Zก-๙\s]+$/.test(first_name)) {
            throw new AppError("Firstname must contain only letter", 400)
        }
        // lastname validate only letter
        if (!/^[a-zA-Zก-๙\s]+$/.test(last_name)) {
            throw new AppError("Lastname must contain only letter", 400)
        }

        const newCustomer = await createUsersService(req.body)
        return res.status(201).json({ newCustomer })

    } catch (err) {
        next(err)
    }
}