import { Router } from 'express'

import {
    createPayment,
    updatePaymentStatus,
    getPaymentById
} from '../../controller/payment.controller'

import { getAllPaymentByLoginUser } from '../../controller/user-detail/profiles.controller'

import {
    authorize
} from '../../middleware/authorize'

const router = Router()

router.route('/me')
    .get(authorize(['customer']), getAllPaymentByLoginUser)

router.route('/:orderId')
    .post(authorize(['customer']), createPayment)

router.route('/:id/status')
    .patch(authorize(['customer']), updatePaymentStatus)

router.route('/:id')
    .get(authorize(['admin', 'customer']), getPaymentById)

export default router
