import { Router } from 'express'

import {
    createCategory,
    admingetAllCategory,
    adminPatchCategory
} from '../../controller/category.controller'

const router = Router()


router.route('/')
    .get(admingetAllCategory)
    .post(createCategory)

router.route('/:id')
    .patch(adminPatchCategory)

export default router