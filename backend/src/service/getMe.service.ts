import { pool } from "../db/connectPostgre.repository"
import { AppError } from "../util/AppError"


export const getUserByIdService = async (userId: number) => {
    const result = await pool.query(`
        select id , username , email , role ,creatd_at
        from users
        where id = $1
        `, [userId])

    if (result.rowCount === 0) {
        throw new AppError("User not found", 404)
    }

    return result.rows[0]
}
