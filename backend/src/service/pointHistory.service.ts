import { pool } from '../db/connectPostgre.repository'
import { AppError } from '../util/AppError'

export const getAllPointsHistory = async () => {
    const response = await pool.query(`
        select 
        
        `)
    return response.rows
}


export const getPointsHistoryByUserId = async (userId: number) => {
    const response = await pool.query(`
        select
        id,
        points,
        source,
        reference_type,
        reference_id,
        created_at
        from points_history
        where user_id = $1
        order by created_at desc
        `,
        [userId]
    )
    return response.rows
}
