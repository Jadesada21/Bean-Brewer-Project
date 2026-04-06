import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

import {
    ProductResponse,
    CreateProductInput,
    UpdateProductPayload,
    DBValues,
} from '../../types/product/product.type'

import { Role } from '../../types/users.type'


export const getAllProductService = async ({
    role,
    price = 'any',
    roast_level,
    page = 1
}: {
    role?: Role | 'guest',
    price: string
    roast_level?: string | undefined
    page: number,
}) => {

    const limit = 10
    const offset = (page - 1) * limit

    if (role === 'admin') {
        const response = await pool.query(` select 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.reward_points,
        p.roast_level,
        p.taste,
        p.category_id,
        p.is_active,
        p.created_at,
        p.updated_at,
        pi.image_urls,
        count(*) over() as total_count,
        coalesce(pi.total_images , 0) as total_images
    from products p     
    left join (
        select 
            product_id,
            json_agg(image_url) filter (where image_url is not null) as image_urls,
            count(*) as total_images
        from product_images
        group by product_id 
    ) pi on pi.product_id = p.id
    order by p.created_at desc
    limit $1 offset $2
        `, [limit, offset])

        const total = response.rows[0]?.total_count ?? 0
        const rows = response.rows.map(({ total_count, ...rest }) => rest)


        return {
            products: rows,
            total
        }
    } else {
        let sql = `
        select  
            p.id,
            p.name,
            p.price,
            p.reward_points,
            p.taste,
            pi.image_url,
            count(*) over() as total_count
        from products p
        left join product_images pi 
        on pi.product_id = p.id 
        and pi.is_primary = true
        where p.is_active = true
       `

        const conditions: string[] = []
        const values: any[] = []
        let paramIndex = 1

        // price filter
        if (price && price !== 'any') {

            if (price.includes('-')) {

                const [min, max] = price.split('-')

                conditions.push(`p.price between $${paramIndex} and $${paramIndex + 1}`)

                values.push(Number(min), Number(max))

                paramIndex += 2

            } else {

                conditions.push(`p.price <= $${paramIndex}`)

                values.push(Number(price))

                paramIndex += 1
            }
        }
        // roast_level filter
        if (roast_level && roast_level !== '') {
            conditions.push(`p.roast_level = $${paramIndex}`)
            values.push(roast_level)
            paramIndex += 1
        }

        // apply condition
        if (conditions.length > 0) {
            sql += ` and ${conditions.join(" and  ")}`
        }

        sql += ` order by p.created_at asc limit $${paramIndex} offset $${paramIndex + 1}`

        values.push(limit, offset)

        const response = await pool.query(sql, values)
        const rows = response.rows.map(({ total_count, ...rest }) => rest)
        const total = response.rows[0]?.total_count ?? 0

        return {
            products: rows,
            total
        }
    }
}

export const createProductService = async (
    body: CreateProductInput
): Promise<ProductResponse> => {

    const { name, description, taste, roast_level, bag_size, price, stock, reward_points, category_id } = body

    const checkCategory = await pool.query(`
    select id from categories where id = $1    
    `, [category_id])

    if (checkCategory.rowCount === 0) {
        throw new AppError("Categories not found", 400)
    }

    const response = await pool.query(`
        insert into products 
        (name, description, taste, roast_level, bag_size, price, stock, reward_points, category_id)
        values($1,$2,$3,$4,$5,$6,$7,$8,$9)
        returning *`,
        [name, description, taste, roast_level, bag_size, price, stock, reward_points, category_id]
    )
    return response.rows[0]
}

export const getProductByIdService = async (id: number, role?: Role | 'guest') => {
    if (role === 'admin') {
        const sql = ` select 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.reward_points,
        p.roast_level,
        p.category_id,
        p.taste,
        p.is_active,
        p.created_at,
        p.updated_at,
        coalesce(img.total_images , 0) as total_images
    from products p 
    left join (
        select 
            product_id,
            count(*) as total_images
        from product_images
        group by product_id 
    ) img on img.product_id = p.id
     where p.id = $1
        `
        const response = await pool.query(sql, [id])
        if (response.rowCount === 0) {
            throw new AppError("Product not found", 404)
        }
        return response.rows[0]
    } else {
        const sql = `
        select  
        p.id,
        p.name,
        p.price,
        p.description,
        p.reward_points,
        p.taste,
        p.roast_level,
        p.bag_size,
        p.reward_points as points,
        pi.image_url
    from products p
    left join product_images pi 
        on pi.product_id = p.id 
        and pi.is_primary = true
        where p.id = $1
        and p.is_active = true
        `
        const response = await pool.query(sql, [id])
        if (response.rowCount === 0) {
            throw new AppError("Product not found", 404)
        }
        return response.rows[0]
    }

}

export const toggleProductActiveService = async (id: number) => {
    const response = await pool.query(`update products set is_active = not is_active
        where id = $1
        RETURNING is_active`,
        [id]
    )

    if (response.rowCount === 0) {
        throw new AppError("Products Not Found", 404)
    }
    return response.rows[0]
}

export const restockProductByIdService = async (
    productId: number,
    quantity: number
) => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // check product exist
        const productResult = await client.query(`
            select id from products where id = $1
            `, [productId])

        if (productResult.rowCount === 0) {
            throw new AppError("Product not found", 400)
        }

        // update product stock
        await client.query(
            `
      update products
      set stock = stock + $1
      where id = $2
      `,
            [quantity, productId]
        )

        // insert stock movement
        const movementResult = await client.query(`
            insert into stock_movements
            (item_type , item_id , quantity , movement_type , reference_type)
            values('product' , $1 , $2 ,'restock' , 'admin')
            returning *
            `, [productId, quantity])

        await client.query("COMMIT")

        return movementResult.rows[0]
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const getAllRestockProductHisService = async (productId: number) => {
    const response = await pool.query(`
        select *
            from stock_movements
        where item_type = 'product'
        and item_id = $1
        and movement_type = 'restock'
        order by created_at desc
        `, [productId])

    if (response.rowCount === 0) {
        throw new AppError("Product not found", 404)
    }

    return response.rows
}

export const getProductByIdAdminService = async (productId: number) => {
    const response = await pool.query(`
        select
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.bag_size,
        p.reward_points,
        p.roast_level,
        p.taste,
        p.category_id,
        p.is_active,
        p.created_at,
        p.updated_at,

        c.id as category_id,
        c.name as category_name,
        c.type as category_type,

        pi.images,
        coalesce(pi.total_images, 0) as total_images
       
    from products p  
    
    left join categories c
        on c.id = p.category_id
        
    left join (
        select 
            product_id,
            json_agg(
                json_build_object(
                    'id', id,
                    'image_url', image_url,
                    'is_primary', is_primary
            )
        ) filter (where image_url is not null) as images,

            count(*) as total_images

        from product_images
        group by product_id 
    )   pi on pi.product_id = p.id
    where p.id = $1
    `, [productId])

    if (response.rowCount === 0) {
        throw new AppError("Product not found", 404)
    }
    return response.rows[0]
}

export const updateProductByIdAdminService = async (id: number, body: UpdateProductPayload) => {

    const allowed = [
        "name",
        "price",
        "stock",
        "reward_points",
        "roast_level",
        "taste",
        "bag_size",
        "description"
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
        update products set
            ${fields.join(", ")}
            where id = $${index}
            returning * 
         `, values)

    if (response.rowCount === 0) {
        throw new AppError("Product not found", 400)
    }
    return response.rows[0]
}