import { Router } from 'express'
const router = Router({ mergeParams: true })

import {
    uploadImageByProductId,
    deleteProductImagesByProductId,
    updatePrimaryImagesByProductId,
    updateSortOrderByProductId
} from '../../../controller/product/image.controller'

import upload from '../../../middleware/upload'


router.route('/')
    .post(upload.array("images", 5), uploadImageByProductId)
    .delete(deleteProductImagesByProductId)

router.route('/primary')
    .patch(updatePrimaryImagesByProductId)

router.route('/sort-order')
    .patch(updateSortOrderByProductId)


export default router