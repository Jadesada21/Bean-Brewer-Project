import { Router } from 'express'

import {
    adminGetAllUsers,
    adminGetUserById,
    adminGetUserDetailById
} from '../../controller/users.controller'


const router = Router()


router.route('/')
    .get(adminGetAllUsers)

router.route('/detail/:id')
    .get(adminGetUserDetailById)

router.route('/:id')
    .get(adminGetUserById)


export default router