import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    PromoCodeTypeResponse,
    PromoCodeTypeInput
} from '../../types/promo.type'


export const getAllPromoCodeService = async (page: number) => {
    const limit = 10
    const offset = (page - 1) * limit

    const response = await pool.query(`
        select *,
        count(*) over() as total_count
        from promo_code 
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

export const createPromoCodeService = async (body: PromoCodeTypeInput): Promise<PromoCodeTypeResponse> => {

    const { code, bonus_points, max_usage } = body

    const normalizedCode = code.trim().toUpperCase()

    const response = await pool.query(`
        insert into promo_code 
        (code , bonus_points , max_usage)
        values($1,$2,$3)
        returning *
        `, [normalizedCode, bonus_points, max_usage])

    return response.rows[0]
}

export const getPromoCodeByIdService = async (id: number) => {
    const response = await pool.query(`
        select * from promo_code where id = $1
        `, [id])

    if (response.rowCount === 0) {
        throw new AppError("Promo code not found ", 404)
    }
    return response.rows[0]
}

export const togglePromoCodeActiveService = async (id: number) => {
    const response = await pool.query(`
        update promo_code
        set is_active = not is_active
        where id = $1
        returning *
        `, [id])

    if (response.rowCount === 0) {
        throw new AppError("Promo code not found", 400)
    }

    return response.rows[0]
}