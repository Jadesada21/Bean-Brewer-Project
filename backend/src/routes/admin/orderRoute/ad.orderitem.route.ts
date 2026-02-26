import { Router } from 'express'

import {
    getAllOrderItem,

} from '../../../controller/orderItem.Controller'

const router = Router()


router.route('/')
    .get(getAllOrderItem)

export default router