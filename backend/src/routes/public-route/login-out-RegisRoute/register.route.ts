import { Router } from 'express'

import {
    createUsers
} from '../../../controller/register.controller'
import { validate } from '../../../middleware/validate'
import { registerSchema } from '../../../Schemas/register.schema'

const router = Router()

router.route('/')
    .post(validate(registerSchema), createUsers)

export default router