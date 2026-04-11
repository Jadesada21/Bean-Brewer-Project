import { NextFunction, Request, Response } from 'express'

import {
    getAllCategoryService,
    createCategoryService,
    getCategoryByIdService,
    getCategoryProductsByIdService,
    getCategoryRewardsByIdService,
    adminGetAllCategoryService,
    adminPatchCategoryService
} from '../service/category.service'

import {
    CreateCategoryInput
} from '../types/category.type'
import { AppError } from '../util/AppError'


export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1

        const { data, total } = await getAllCategoryService(page)
        return res.status(200).json({ data, total })
    } catch (err) {
        next(err)
    }
}


export const createCategory = async (req: Request<{}, {}, CreateCategoryInput>, res: Response, next: NextFunction) => {
    try {
        const data = await createCategoryService(req.body)
        return res.status(201).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("Invalid categories Id", 400)
        }

        const data = await getCategoryByIdService(id)

        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}


export const getCategoryProductsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (isNaN(id)) {
            throw new AppError("Invalid categories Id", 400)
        }
        const data = await getCategoryProductsByIdService(id)

        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}


export const getCategoryRewardsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("Invalid categories Id", 400)
        }

        const data = await getCategoryRewardsByIdService(id)

        return res.status(200).json({ status: "Success", data })
    } catch (err) {
        next(err)
    }
}

export const admingetAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 1


        const { data, total } = await adminGetAllCategoryService(page)
        return res.status(200).json({ data, total })
    } catch (err) {
        return next(err)
    }
}

export const adminPatchCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new AppError("Invalid categories Id", 400)
        }

        const data = await adminPatchCategoryService(id, req.body)
        return res.status(200).json({ data })
    } catch (err) {
        return next(err)
    }
}