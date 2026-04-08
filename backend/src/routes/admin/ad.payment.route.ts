import { Router } from 'express'


import {
    getAllPayment,
    AdminGetPaymentDetailById
} from '../../controller/payment.controller'

const router = Router()

router.route('/')
    .get(getAllPayment)

router.route('/detail/:id')
    .get(AdminGetPaymentDetailById)

export default router