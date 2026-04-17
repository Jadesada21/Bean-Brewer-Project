import { pool } from '../db/connectPostgre.repository'
import { Role } from '../types/users.type'
import { AppError } from '../util/AppError'


export const getAllPointsHistoryService = async (userId?: number, limit = 20) => {
    let sql = ` select
        ph.id,
        ph.user_id,
        ph.points,
        ph.source,
        ph.reference_type,
        ph.reference_id,
        ph.created_at
        from point_histories ph
    `
    const values: any[] = []

    if (userId) {
        sql += ` where ph.user_id =$1`
        values.push(userId)
    }

    sql += ` order by ph.created_at desc`

    sql += ` limit $${values.length + 1}`
    values.push(limit)

    const response = await pool.query(sql, values)
    return response.rows
}


export const AdminGetPointsHistoryByUserIdService = async (
    UserId: number,
    limit: number,
) => {

    const response = await pool.query(`
        select *
        from point_histories
        where user_id = $1
        order by created_at desc
        limit $2
    `, [UserId, limit])

    return response.rows
}


export const getPointsHistoryByUserIdService = async (
    UserId: number,
    page: number,
) => {
    const limit = 10
    const offset = (page - 1) * limit

    const response = await pool.query(`
        select *,
        count(*) over() as total_count
        from point_histories
        where user_id = $1
        order by created_at desc
        limit $2 offset $3
    `, [UserId, limit, offset])

    const rows = response.rows.map(({ total_count, ...rest }) => rest)
    const total = response.rows[0]?.total_count ?? 0

    return {
        data: rows,
        total
    }
}


