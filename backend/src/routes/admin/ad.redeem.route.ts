import { Router } from 'express'

import {
    getAllRedeem,
    adminGetRedeemById,
    getRedeemByUserId
} from '../../controller/redeem/redeem.controller'


const router = Router()


router.route('/')
    .get(getAllRedeem)


router.route('/:id')
    .get(adminGetRedeemById)


router.route('/user/:userId')
    .get(getRedeemByUserId)


export default router