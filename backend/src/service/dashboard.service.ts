import { pool } from '../db/connectPostgre.repository'

import {
    CountProps,
    TotalOrderProps,
    TotalRevenueProps,
    TotalUsedProps
} from '../types/dashboard.type'

import { safeNumber } from '../constants/safeNumber'


export const getDashboardService = async () => {
    const [allOrders, completedOrder, allRevenue, allUsers, allProducts, allRewards, allRedeems, allPromoCode, allUsedCountPromoCode] = await Promise.all([
        pool.query<CountProps>(`select count(*) from orders`),
        pool.query<TotalOrderProps>(`select coalesce(count(*) filter(where status = 'completed'),0) as total_orders from orders`),
        pool.query<TotalRevenueProps>(`select coalesce(sum(amount),0) as total_revenue from payment where status = 'completed'`),
        pool.query<CountProps>(`select count(*) from users`),
        pool.query<CountProps>(`select count(*) from products`),
        pool.query<CountProps>(`select count(*) from rewards`),
        pool.query<CountProps>(`select count(*) from redeems`),
        pool.query<CountProps>(`select count(*) from promo_code`),
        pool.query<TotalUsedProps>(`select coalesce(sum(used_count),0) as total_used from promo_code`),
    ])


    return {
        totalOrders: safeNumber(allOrders.rows[0].count),
        completedOrders: safeNumber(completedOrder.rows[0].total_orders),
        totalRevenues: safeNumber(allRevenue.rows[0].total_revenue),
        totalUsers: safeNumber(allUsers.rows[0].count),
        totalProducts: safeNumber(allProducts.rows[0].count),
        totalRewards: safeNumber(allRewards.rows[0].count),
        totalRedeems: safeNumber(allRedeems.rows[0].count),
        totalPromoCodes: safeNumber(allPromoCode.rows[0].count),
        totalUsedPromoCodes: safeNumber(allUsedCountPromoCode.rows[0].total_used)
    }
}