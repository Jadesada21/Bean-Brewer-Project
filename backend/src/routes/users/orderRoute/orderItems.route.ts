import { Router } from 'express'

import {
    getOrderItemByOrderId
} from '../../controller/orderItem.Controller'

const router = Router()

router.route('/detail')
    .get(getOrderItemByOrderId)

export default router