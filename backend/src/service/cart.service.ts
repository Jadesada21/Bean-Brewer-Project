import { pool } from '../db/connectPostgre.repository'


export const getCartByLoginUserService = async (userId: number) => {
    const response = await pool.query(`
        SELECT 
            ci.id AS cart_item_id,
            p.id AS product_id,
            p.name,
            p.price,
            ci.quantity
        FROM cart c
        JOIN cart_items ci ON c.id = ci.cart_id
        JOIN products p ON ci.product_id = p.id
        WHERE c.user_id = $1
        `,
        [userId]
    )

    return response.rows
}

export const addToCartService = async (
    userId: number,
    productId: number,
    quantity: number
) => {
    let cart = await pool.query(`
        select id from cart where user_id =$1
        `, [userId])

    let cartId

    if (cart.rowCount === 0) {
        const newCart = await pool.query(`
            insert into cart 
            (user_id)
            values($1) 
            returning id
            `, [userId])

        cartId = newCart.rows[0].id
    } else {
        cartId = cart.rows[0].id
    }

    const existingItem = await pool.query(`
            select id , quantity 
            from cart_items
            where cart_id = $1
            and product_id = $2
        `, [cartId, productId])

    if (existingItem.rows.length > 0) {
        await pool.query(`
            update cart_items
            set quantity = quantity + $1
            where id = $2
            `, [quantity, existingItem.rows[0].id])


    } else {
        await pool.query(`
            insert into cart_items (cart_id , product_id , quantity)
            values ($1,$2,$3)
            `, [cartId, productId, quantity])
    }
}

export const getCartItemsService = async (userId: number) => {

    const cart = await pool.query(`
        select id
        from cart
        where user_id = $1
    `, [userId])

    if (cart.rows.length === 0) {
        return []
    }

    const cartId = cart.rows[0].id

    const items = await pool.query(`
        select
            ci.id as cart_item_id,
            ci.product_id,
            p.name,
            p.price,
            p.bag_size,
            ci.quantity,
            pi.image_url
        from cart_items ci
        join products p
            on ci.product_id = p.id
        left join product_images pi
            on p.id = pi.product_id
            and pi.is_primary = true
        where ci.cart_id = $1
        order by ci.id desc
    `, [cartId])

    return items.rows
}

export const updateCartItemService = async (
    userId: number,
    cartItemId: number,
    quantity: number
) => {

    await pool.query(`
        update cart_items ci
        set quantity = $1
        from cart c 
        where ci.cart_id = c.id
        and c.user_id = $2
        and ci.id = $3
        `, [quantity, userId, cartItemId])
}

export const deleteCartItemService = async (
    userId: number,
    cartItemId: number
) => {

    await pool.query(`
        delete from cart_items ci
        using cart c
        where ci.cart_id = c.id
        and c.user_id = $1
        and ci.id = $2
        `, [userId, cartItemId])
}