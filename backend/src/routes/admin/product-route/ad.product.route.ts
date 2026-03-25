import { Router } from 'express'

import {
    createProduct,
    toggleProductActive,
    restockProductByid,
    getAllRestockProductHis,
    getProductByIdAdmin,
    updateProductByIdAdmin
} from '../../../controller/product/product.controller'

import adminImageProductRoute from './ad.image.product.route'


const router = Router()


router.route('/')
    .post(createProduct)

router.route('/:id/restock')
    .post(restockProductByid)

router.route('/:id/stock-history')
    .get(getAllRestockProductHis)

router.route('/:id/toggle-active')
    .patch(toggleProductActive)

router.route('/:id')
    .get(getProductByIdAdmin)
    .patch(updateProductByIdAdmin)

// ********************** image_product

router.use('/:product_id/images', adminImageProductRoute)


export default router