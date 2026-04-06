import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    RewardResponse,
    CreateRewardInput,
    UpdateRewardPayload,
    DBValues
} from '../../types/reward/reward.type'

import { Role } from '../../types/users.type'

export const getAllRewardService = async ({
    role,
    points = 'any',
    category,
    page = 1
}: {
    role: Role | 'guest'
    points: string
    category?: number
    page: number
}) => {

    const limit = 9
    const offset = (page - 1) * limit

    if (role === 'admin') {
        const response = await pool.query(` select 
        r.id,
        r.name,
        r.description,
        r.short_description,
        r.points_required,
        r.stock,
        r.category_id,
        r.is_active,
        r.created_at,
        r.updated_at,
        count(*) over() as total_count,
        coalesce(img.total_images , 0) as total_images
    from rewards r
    left join (
        select
            reward_id,
            count(*) as total_images
        from reward_images
        group by reward_id
    ) img on img.reward_id = r.id
    order by r.created_at desc
    limit $1 offset $2
        `, [limit, offset])

        const total = response.rows[0]?.total_count ?? 0
        const rows = response.rows.map(({ total_count, ...rest }) => rest)


        return {
            rewards: rows,
            total
        }
    } else {
        let sql = `
        select
            r.id,
            r.name,
            r.points_required,
            c.name as category_name,
            ri.image_url,
        count(*) over() as total_count
        from rewards r
        left join categories c 
        on r.category_id = c.id
        left join reward_images ri 
        on ri.reward_id = r.id 
        and ri.is_primary = true
        where r.is_active = true
        `

        const conditions: string[] = []
        const values: any[] = []
        let paramIndex = 1

        // point filter
        if (points && points !== "any") {

            if (points.includes("-")) {
                const [min, max] = points.split("-")

                conditions.push(`r.points_required between $${paramIndex} and $${paramIndex + 1}`)
                values.push(Number(min), Number(max))

                paramIndex += 2
            } else if (points.includes("+")) {

                const min = points.replace("+", "")

                conditions.push(`r.points_required <= $${paramIndex}`)
                values.push(Number(points))

                paramIndex++
            }
        }

        // category filter
        if (category) {
            conditions.push(`r.category_id = $${paramIndex}`)
            values.push(category)
            paramIndex++
        }

        if (conditions.length > 0) {
            sql += ` and ${conditions.join(" and ")}`
        }

        sql += ` order by r.created_at desc limit $${paramIndex} offset $${paramIndex + 1}`

        values.push(limit, offset)

        const response = await pool.query(sql, values)
        const total = response.rows[0]?.total_count ?? 0
        const rows = response.rows.map(({ total_count, ...rest }) => rest)
        return {
            rewards: rows,
            total
        }
    }
}


export const createRewardService = async (
    body: CreateRewardInput
): Promise<RewardResponse> => {

    const { name, description, short_description, stock, points_required, category_id } = body

    const checkCategory = await pool.query(`
        select id from categories where id = $1
        `,
        [category_id]
    )

    const response = await pool.query(`
        insert into rewards 
        (name , description ,short_description, stock , points_required , category_id)
        values ($1,$2,$3,$4,$5,$6)
        returning *
        `,
        [name, description, short_description, stock, points_required, category_id]
    )
    return response.rows[0]
}


export const getRewardByIdService = async (id: number, role?: string) => {
    if (role === 'admin') {
        const sql = ` select 
        r.id,
        r.name,
        r.description,
        r.short_description,
        r.points_required,
        r.stock,
        r.category_id,
        r.is_active,
        r.created_at,
        r.updated_at,
        coalesce(img.total_images , 0) as total_images
    from rewards r
    left join (
        select
            reward_id,
            count(*) as total_images
        from reward_images
        group by reward_id
    ) img on img.reward_id = r.id
     where r.id = $1
        `
        const response = await pool.query(sql, [id])
        if (response.rowCount === 0) {
            throw new AppError("Reward not found", 404)
        }
        return response.rows[0]
    } else {
        const sql = `
        select
        r.id,
        r.name,
        r.points_required,
        r.description,
        r.short_description,
        ri.image_url
        from rewards r
        left join reward_images ri
        on ri.reward_id = r.id 
        and ri.is_primary = true
        where r.id = $1
        and r.is_active = true`
        const response = await pool.query(sql, [id])

        if (response.rowCount === 0) {
            throw new AppError("Reward not found", 404)
        }
        return response.rows[0]
    }
}


export const toggleRewardActiveService = async (id: number) => {
    const response = await pool.query(`update rewards set is_active = not is_active
        where id = $1
        RETURNING is_active`,
        [id]
    )

    if (response.rowCount === 0) {
        throw new AppError("rewards Not Found", 404)
    }

    return response.rows[0]
}

export const restockRewardByIdService = async (
    RewardId: number,
    quantity: number
) => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // check reward exist
        const rewardResult = await client.query(`
            select id from rewards where id = $1
            `, [RewardId])

        if (rewardResult.rowCount === 0) {
            throw new AppError("Reward not found", 400)
        }

        // update reward stock
        await client.query(
            `
      update rewards
      set stock = stock + $1
      where id = $2
      `,
            [quantity, RewardId]
        )

        // insert stock movement
        const movementResult = await client.query(`
            insert into stock_movements
            (item_type , item_id , quantity , movement_type , reference_type)
            values('reward' , $1 , $2 ,'restock' , 'admin')
            returning *
            `, [RewardId, quantity])

        await client.query("COMMIT")

        return movementResult.rows[0]
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const getAllRestockRewardHisService = async (rewardId: number) => {
    const response = await pool.query(`
        select *
            from stock_movements
        where item_type = 'reward'
        and item_id = $1
        and movement_type = 'restock'
        order by created_at desc
        `, [rewardId])

    if (response.rowCount === 0) {
        throw new AppError("Rewards not found", 404)
    }

    return response.rows
}

export const getRewardByIdAdminService = async (rewardId: number) => {
    const response = await pool.query(`
        select
        r.id,
        r.name,
        r.description,
        r.short_description,
        r.points_required,
        r.stock,
        r.category_id,
        r.is_active,
        r.created_at,
        r.updated_at,

        c.id as category_id,
        c.name as category_name,
        c.type as category_type,

        ri.images,
        coalesce(ri.total_images, 0) as total_images
       
    from rewards r  
    
    left join categories c
        on c.id = r.category_id
        
    left join (
        select 
            reward_id,
            json_agg(
                json_build_object(
                    'id', id,
                    'image_url', image_url,
                    'is_primary', is_primary
            )
        ) filter (where image_url is not null) as images,

            count(*) as total_images

        from reward_images
        group by reward_id 
    )   ri on ri.reward_id = r.id
    where r.id = $1
    `, [rewardId])

    if (response.rowCount === 0) {
        throw new AppError("Reward not found", 404)
    }
    return response.rows[0]
}

export const updateRewardByIdAdminService = async (id: number, body: UpdateRewardPayload) => {

    const allowed = [
        "name",
        "description",
        "short_description",
        "points_required",
    ]

    const fields: string[] = []
    const values: DBValues[] = []
    let index = 1

    for (const [key, value] of Object.entries(body)) {
        // check allowed FIRST (สำคัญมาก)
        if (!allowed.includes(key)) continue
        // check empty
        if (value === undefined || value === "") continue
        fields.push(`${key} = $${index++}`)
        values.push(value)
    }

    if (fields.length === 0) {
        throw new AppError("No valid fields to update", 400)
    }

    values.push(id)


    const response = await pool.query(`
        update rewards set
            ${fields.join(", ")}
            where id = $${index}
            returning * 
         `, values)

    if (response.rowCount === 0) {
        throw new AppError("Reward not found", 404)
    }
    return response.rows[0]
}