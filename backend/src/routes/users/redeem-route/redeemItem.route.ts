import express from 'express'

const router = express.Router({ mergeParams: true })

import { authorize } from '../../../middleware/authorize'
import { getRedeemItemByUserId } from '../../../controller/redeem/redeemItem.controller'



router.route('/')
    .get(authorize(['admin', 'customer']), getRedeemItemByUserId)


export default router