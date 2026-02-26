import { Router } from 'express'

import {
    createProduct,
    toggleProductActive
} from '../../../controller/product/product.controller'

import adminImageProductRoute from './ad.image.product.route'

import { authorize } from '../../../middleware/authorize'


const router = Router()

router.use(authorize('admin'))

router.route('/')
    .post(createProduct)

router.route('/:id')
    .patch(toggleProductActive)


// ********************** image_product

router.use('/:product_id/images', adminImageProductRoute)


export default router