import { Router } from 'express'

import {
    getAllUsers,
    getUsersById
} from '../../controller/users.controller'


const router = Router()


router.route('/')
    .get(getAllUsers)

router.route('/:id')
    .get(getUsersById)


export default router