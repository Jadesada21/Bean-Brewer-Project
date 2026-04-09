import { pool } from '../db/connectPostgre.repository'
import { AppError } from '../util/AppError'



export const getAllStockmovementService = async (page: number) => {
    const limit = 10
    const offset = (page - 1) * limit

    const response = await pool.query(`
        select *,
        count(*) over() as total_count
        from stock_movements
        order by created_at desc
        limit $1 offset $2
        `, [limit, offset])

    const rows = response.rows.map(({ total_count, ...rest }) => rest)
    const total = response.rows[0]?.total_count ?? 0

    return {
        data: rows,
        total
    }
}

export const getStockmovementByIdService = async (id: number) => {
    const response = await pool.query(`
        select * from stock_movements
        where id = $1
        `, [id])

    if (response.rowCount === 0) {
        throw new AppError("Stock movement not found", 404)
    }
    return response.rows[0]
}

