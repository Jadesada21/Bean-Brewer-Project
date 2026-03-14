import { Router } from 'express'

import {
    getAllOrder,
    getOrderById,
    getOrderDetailsById
} from '../../controller/order/order.controller'


const router = Router()


router.route('/')
    .get(getAllOrder)

router.route('/detail/:id')
    .get(getOrderDetailsById)

router.route('/:id')
    .get(getOrderById)



export default router