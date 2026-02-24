import { Router } from 'express'

import {
    getAllOrder,
    createOrder,
    updateStatusOrder,
    getOrderById,
    getOrderByUserId
} from '../controller/order.controller'

import { authorize } from '../middleware/authorize'


const router = Router()


router.route('/')
    .get(authorize('admin'), getAllOrder)
    .post(createOrder)

router.route('/me')
    .get(getOrderByUserId)

router.route('/:id')
    .get(authorize('admin'), getOrderById)

router.route('/:id/status')
    .patch(updateStatusOrder)

export default router