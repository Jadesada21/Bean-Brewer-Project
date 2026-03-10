import { Router } from 'express'

import {
    getAllPromoCodeUsageByLoginUser,
    redeemPromoCode
} from '../../../controller/promo/promoCodeUsages.controller'

import { authorize } from '../../../middleware/authorize'

const router = Router()

router.route('/me')
    .get(authorize(['customer']), getAllPromoCodeUsageByLoginUser)


export default router