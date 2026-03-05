import { Router } from 'express'
const router = Router({ mergeParams: true })

import {
    uploadImageByRewardId,
    updatePrimaryImagesByRewardId,
    deleteRewardImagesByRewardId,
    updateSortOrderByRewardId
} from '../../../controller/reward/image.controller'


import upload from '../../../middleware/upload'


router.route('/')
    .post(upload.array("images", 5), uploadImageByRewardId)
    .delete(deleteRewardImagesByRewardId)

router.route('/primary')
    .patch(updatePrimaryImagesByRewardId)

router.route('/sort-order')
    .patch(updateSortOrderByRewardId)

export default router