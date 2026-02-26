import { Router } from 'express'
const router = Router({ mergeParams: true })

import {
    getImageById,
} from '../../../controller/product/image.controller'


router.route('/:id')
    .get(getImageById)

export default router