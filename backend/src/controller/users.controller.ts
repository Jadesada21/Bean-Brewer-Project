import { NextFunction, Request, Response } from 'express'
import {
    getAllUsersService,
    getUsersByIdService,
    updateUsersByLoginUserService,
    getAllUsersAddressService,
    createUsersAddressByIdService,
    updateAddressUserByLoginUserService,
    getAllMyAddressService,
    setdefaultAddressService,
    getPrimaryService,
    adminGetAllUsersService,
    adminGetUserByIdService,
    adminGetUserDetailByIdService
} from '../service/users.service'



import {
    AddUsersAddressByIdInput,
    UpdateUsersAddressInput
} from '../types/address.type'

import { AppError } from '../util/AppError'



export const updateUsersByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await updateUsersByLoginUserService(
            req.user!.id,
            req.body
        )

        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}


// ****************************** ADDRESS



export const getAllUsersAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getAllUsersAddressService()

        return res.status(200).json({ status: "Success", user })
    } catch (err) {
        next(err)
    }
}


export const addUsersAddressById = async (req: Request<{}, {}, AddUsersAddressByIdInput>, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id

        const { address_line, country, province, district, subdistrict, postal_code, is_default } = req.body

        if (!address_line || !country || !province || !district || !subdistrict || !postal_code) {
            throw new AppError("Missing required field", 400)
        }

        const fields = [address_line, country, province, district, subdistrict, postal_code]

        if (fields.some(fields => fields.length > 50)) {
            throw new AppError("Input must not exceed 50 characters", 400)
        }

        const newAddress = await createUsersAddressByIdService(userId, req.body)
        return res.status(201).json({ status: "Success", newAddress })
    } catch (err) {
        next(err)
    }
}


export const updateAddressUserByLoginUser = async (req: Request<{ id: string }, {}, UpdateUsersAddressInput>, res: Response, next: NextFunction) => {
    try {
        const addressId = Number(req.params.id)

        if (isNaN(addressId)) {
            throw new AppError("Invalid address id ", 400)
        }

        if (!req.user) {
            throw new AppError("Forbidden", 401)
        }

        const userId = req.user!.id


        const updated = await updateAddressUserByLoginUserService(userId, addressId, req.body)

        res.status(200).json({ status: "Success", updated })
    } catch (err) {
        next(err)
    }
}

export const getAllMyAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllMyAddressService(req.user!.id)
        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }

}

export const setdefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addressId = Number(req.params.id)
        if (Number.isNaN(addressId)) {
            throw new AppError("Invalid address Id ", 400)
        }

        const userId = req.user!.id
        const data = await setdefaultAddressService(userId, addressId)
        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}

export const getPrimary = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userId = req.user!.id

        const data = await getPrimaryService(userId)
        return res.status(200).json({ data })
    } catch (err) {
        next(err)
    }
}


// ************************ ADMIN

export const adminGetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1

        const { data, total } = await adminGetAllUsersService(page)
        return res.status(200).json({ data, total })
    } catch (err) {
        return next(err)
    }
}

export const adminGetUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("Invalid User id ", 400)
        }
        const data = await adminGetUserByIdService(id)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}

export const adminGetUserDetailById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("Invalid User Id", 400)
        }

        const data = await adminGetUserDetailByIdService(id)

        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}