import { Router } from 'express'

import {
    getOrderItemByOrderIdandUserId
} from '../../../controller/order/orderItem.Controller'

import { authorize } from '../../../middleware/authorize'

const router = Router()

router.route('/')
    .get(authorize(['admin', 'customer']), getOrderItemByOrderIdandUserId)


export default router