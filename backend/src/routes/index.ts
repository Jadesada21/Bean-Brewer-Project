import { Router } from 'express'
import userRoute from './users/users.route'
import categoryRoute from './users/category.route'
import productsRoute from './users/productRoute/products.route'
import addressRoute from './users/address.route'
import loginRoute from './login-out-RegisRoute/login.route'
import logoutRoute from './login-out-RegisRoute/logout.route'
import registerRoute from './login-out-RegisRoute/register.route'
import rewardsRoute from './users/rewardRoute/rewards.route'
import orderRoute from './users/orderRoute/order.route'
import { authenticate } from '../middleware/authenticate'

import adminCategoryRoute from './admin/ad.category.route'
import adminProductRoute from './admin/productRoute/ad.product.route'
import adminRewardRoute from './admin/rewardRoute/ad.reward.route'
import adminOrderRoute from './admin/orderRoute/ad.order.route'
const router = Router()

// public route

router.use('/register', registerRoute)
router.use('/login', loginRoute)


// verify route
// users route

router.use(authenticate)

router.use('/logout', logoutRoute)
router.use('/users', userRoute)
router.use('/addresses', addressRoute)
router.use('/categories', categoryRoute)
router.use('/products', productsRoute)
router.use('/rewards', rewardsRoute)
router.use('/orders', orderRoute)


// authen admin

router.use('/admin/categories', adminCategoryRoute)
router.use('/admin/products', adminProductRoute)
router.use('/admin/rewards', adminRewardRoute)
router.use('/admin/orders', adminOrderRoute)


export default router