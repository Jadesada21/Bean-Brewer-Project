import { Router } from 'express'
import { getDashboard } from '../../controller/dashboard.controller'


const router = Router()


router.route('/')
    .get(getDashboard)

export default router