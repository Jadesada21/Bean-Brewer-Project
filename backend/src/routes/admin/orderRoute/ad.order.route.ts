import { Router } from 'express'

import {
    getAllOrder,
    getOrderById
} from '../../../controller/order.controller'

import orderItemRoute from './ad.orderitem.route'

import { authorize } from '../../../middleware/authorize'


const router = Router()

router.use(authorize('admin'))

router.route('/')
    .get(getAllOrder)

router.route('/:id')
    .get(getOrderById)


// ******************** order_items
router.use('/:orderId/items', orderItemRoute)


export default router