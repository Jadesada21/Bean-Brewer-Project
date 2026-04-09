import { Router } from 'express'


import {
    getAllPayment,
    AdminGetPaymentDetailById,
    AdminGetPaymentById
} from '../../controller/payment.controller'

const router = Router()

router.route('/')
    .get(getAllPayment)

router.route('/detail/:id')
    .get(AdminGetPaymentDetailById)

router.route('/:id')
    .get(AdminGetPaymentById)
export default router