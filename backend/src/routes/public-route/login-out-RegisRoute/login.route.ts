import { Router } from 'express'
import rateLimit from 'express-rate-limit'

import {
    login
} from '../../../controller/login.controller'

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 })

const router = Router()

router.route('/')
    .post(loginLimiter, login)

export default router