import { Router } from 'express'

import {
    getProductBySearch
} from '../../../controller/login.controller'

const router = Router()

router.route('/')
    .get(getProductBySearch)

export default router