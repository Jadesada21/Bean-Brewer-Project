import { Router } from 'express'

import {
    createCategory,
    admingetAllCategory
} from '../../controller/category.controller'

const router = Router()


router.route('/')
    .get(admingetAllCategory)
    .post(createCategory)



export default router