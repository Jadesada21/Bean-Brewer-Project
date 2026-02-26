import { pool } from '../db/connectPostgre.repository'
import { AppError } from '../util/AppError'



export const getAllOrderItemService = async (userId?: number) => {
    let sql = ` select
        ph.id,
        ph.user_id,
        ph.points,
        ph.source,
        ph.reference_type,
        ph.reference_id,
        ph.created_at
        from points_history ph
    `
    const values: any[] = []

    if (userId) {
        sql += `where ph.user_id =$1`
        values.push(userId)
    }

    sql += `order by ph.created_at desc`

    const response = await pool.query(sql, values)
    return response.rows
}

export const getOrderItemByOrderIdService = async (orderId: number, limit = 10) => {
    const response = await pool.query(`
        select 
        oi.id,
        oi.order_id,
        oi.product_id,
        p.name,
        oi.quantity,
        oi.price,
        oi.reward_points
        from order_item oi
        join products p on p.id = p.product_id
        where oi.order_id = $1
        order by oi.id
        `,
        [orderId, limit])

    if (response.rowCount === 0) {
        throw new AppError("Order items not found", 404)
    }

    return response.rows
}