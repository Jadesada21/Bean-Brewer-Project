import { Router } from 'express'

import {
    getAllRedeem,
    adminGetRedeemById,
    adminGetRedeemDetailById
} from '../../controller/redeem/redeem.controller'


const router = Router()


router.route('/')
    .get(getAllRedeem)

router.route('/detail/:id')
    .get(adminGetRedeemDetailById)

router.route('/:id')
    .get(adminGetRedeemById)



export default router