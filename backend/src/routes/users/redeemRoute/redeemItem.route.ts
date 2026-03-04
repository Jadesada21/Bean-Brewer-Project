import { Router } from 'express'


import { authorize } from '../../../middleware/authorize'
import { getRedeemItemByUserId } from '../../../controller/redeem/redeemItem.controller'

const router = Router()

router.route('/')
    .get(authorize(['admin', 'customer']), getRedeemItemByUserId)


export default router