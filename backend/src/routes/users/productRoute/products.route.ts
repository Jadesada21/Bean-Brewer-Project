import { Router } from 'express'

import {
    getAllProduct,
    getProductById
} from '../../../controller/product/product.controller'

import imageProductRoute from './imageProduct.route'


const router = Router()

router.route('/')
    .get(getAllProduct)


router.route('/:id')
    .get(getProductById)


// ************************ Image_product

router.use('/:product_id/images', imageProductRoute)

export default router