import { Router } from 'express'

import {
    createReward,
    toggleRewardActive,
    restockRewardByid,
    getAllRestockRewardHis,
    getRewardByIdAdmin,
    updateRewardByIdAdmin
} from '../../../controller/reward/reward.controller'

import imageRewardRoute from './ad.image.reward.route'

const router = Router()


router.route('/')
    .post(createReward)

router.route('/:id/restock')
    .post(restockRewardByid)

router.route('/:id/stock-history')
    .get(getAllRestockRewardHis)

router.route('/:id/toggle-active')
    .patch(toggleRewardActive)

router.route('/:id')
    .get(getRewardByIdAdmin)
    .patch(updateRewardByIdAdmin)


// ********************** image_reward

router.use('/:reward_id/images', imageRewardRoute)


export default router