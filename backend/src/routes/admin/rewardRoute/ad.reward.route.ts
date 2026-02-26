import { Router } from 'express'

import { authorize } from '../../../middleware/authorize'

import {
    createReward,
    toggleRewardActive
} from '../../../controller/reward/reward.controller'

import imageRewardRoute from '../../admin/rewardRoute/ad.image.reward.route'

const router = Router()

router.use(authorize('admin'))

router.route('/')
    .post(createReward)

router.route('/:id')
    .patch(toggleRewardActive)


// ********************** image_reward

router.use('/:reward_id/images', imageRewardRoute)


export default router