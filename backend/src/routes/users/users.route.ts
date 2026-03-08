import { Router } from "express";

import {
    getUserByLoginUser,
    updateUsersById,
} from '../../controller/users.controller'

import { authorize } from '../../middleware/authorize'




const router = Router();


router.route('/:id')
    .patch(authorize(['customer']), updateUsersById)

router.route('/me')
    .get(authorize(['customer']), getUserByLoginUser)

export default router;