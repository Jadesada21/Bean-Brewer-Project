import { Router } from 'express'

import {
    getAllPointsHistory,
    AdminGetPointsHistoryByUserId
} from '../../controller/pointHistories.controller'

const router = Router()


router.route('/')
    .get(getAllPointsHistory)

router.route('/users/:userId')
    .get(AdminGetPointsHistoryByUserId)


export default router