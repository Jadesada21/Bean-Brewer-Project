import { Router } from 'express'

import {
    createCategory
} from '../../controller/category.controller'
import { authorize } from '../../middleware/authorize'

const router = Router()

router.use(authorize('admin'))

router.route('/')
    .post(createCategory)



export default router