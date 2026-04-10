import { Router } from 'express'

import {
    createCategory,
    admingetAllCategory,
    adminPatchNameCategory
} from '../../controller/category.controller'

const router = Router()


router.route('/')
    .get(admingetAllCategory)
    .post(createCategory)

router.route('/:id')
    .patch(adminPatchNameCategory)

export default router