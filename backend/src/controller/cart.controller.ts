import { NextFunction, Request, Response } from 'express'

import {
    getCartByLoginUserService,
    addToCartService,
    updateCartItemService,
    deleteCartItemService,
    getCartItemsService
} from '../service/cart.service'
import { AppError } from '../util/AppError'


export const getCartByLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginUserId = req.user!.id

        const cart = await getCartByLoginUserService(loginUserId)

        res.status(200).json({ status: "success", data: cart })
    } catch (err) {
        next(err)
    }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { product_id, quantity } = req.body
        const loginUserId = req.user!.id
        const productId = Number(product_id)
        const qty = Number(quantity)

        if (!product_id || isNaN(productId)) {
            throw new AppError("Invalid product id", 400)
        }

        if (!quantity || isNaN(qty) || qty < 1) {
            throw new AppError("Invalid quantity", 400)
        }

        const data = await addToCartService(loginUserId, productId, qty)
        res.status(201).json({ status: "success", data: data })

    } catch (error) {
        next(error)
    }
}

export const getCartItems = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const loginUserId = req.user!.id

        const data = await getCartItemsService(loginUserId)

        res.status(200).json({
            status: "success",
            data
        })

    } catch (error) {
        next(error)
    }
}

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const loginUserId = req.user!.id
        const id = Number(req.params.id)
        const quantity = Number(req.body)

        if (!id || isNaN(id)) {
            throw new AppError("Invalid cart item id", 400)
        }

        if (!quantity || isNaN(quantity) || Number(quantity) < 1) {
            throw new AppError("Invalid quantity", 400)
        }

        const data = await updateCartItemService(loginUserId, id, quantity)

        res.status(200).json({ status: "success", data: data })

    } catch (error) {
        next(error)
    }
}

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const loginUserId = req.user!.id
        const id = Number(req.params.id)

        if (!id || isNaN(id)) {
            throw new AppError("Invalid cart item id", 400)
        }

        const data = await deleteCartItemService(loginUserId, id)

        res.status(200).json({ status: "success", data: data })
    } catch (error) {
        next(error)
    }
}