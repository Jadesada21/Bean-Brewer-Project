import { pool } from '../db/connectPostgre.repository'
import { PaymentUpdateStatus } from '../types/payment.type'
import { Role } from '../types/users.type'
import { AppError } from '../util/AppError'


export const getAllPaymentService = async () => {
    const response = await pool.query(`
        select 
        id,
        order_id,
        amount,
        status,
        transaction_ref,
        created_at,
        paid_at,
        payment_provider
        from payment 
        order by created_at desc
        `)
    return response.rows
}

export const createPaymentService = async (order_id: number, userId: number) => {

    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // get order
        const orderResult = await client.query(`
            select 
            id,
            total_price ,
            status 
            from orders
            where id = $1 
            and user_id = $2
            for update
            `, [order_id, userId]
        )

        if (orderResult.rowCount === 0) {
            throw new AppError("Order not found", 400)
        }

        const order = orderResult.rows[0]

        if (order.status !== 'pending') {
            throw new AppError("Order already process", 400)
        }

        // gen transaction_ref
        const transaction_ref = `MOCK-${Date.now()}-${order_id}`

        // ตรวจสอบว่ามี pending payment ของ order นี้อยู่แล้วหรือไม่ (กันสร้าง payment ซ้ำ)
        const existingPayment = await client.query(`
            select id
            from payment 
            where order_id = $1
            and status = 'pending'
            for update
            `, [order_id]
        )

        const existingCount = existingPayment.rowCount ?? 0

        if (existingCount > 0) {
            throw new AppError("Pending payment already exists", 400)
        }

        // create payment
        const paymentResult = await client.query(`
            insert into payment
           (order_id , amount , transaction_ref ,status ,payment_provider)
            values($1,$2,$3,'pending','mock')
            returning *
            `,
            [order_id, order.total_price, transaction_ref]
        )

        await client.query("COMMIT")
        return paymentResult.rows[0]
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }

}

export const updatePaymentStatusService = async (
    paymentId: number,
    newStatus: PaymentUpdateStatus,
    loginUserId: number, role: string
) => {

    const client = await pool.connect()
    try {
        await client.query(`BEGIN`)

        // lock payment
        const paymentResult = await client.query(`
            select * from payment
            where id = $1
            for update
            `, [paymentId])

        if (paymentResult.rowCount === 0) {
            throw new AppError("Payment not found ", 400)
        }

        const payment = paymentResult.rows[0]

        if (payment.status !== 'pending') {
            throw new AppError("Payment already processed", 400)
        }

        // lock order
        const orderResult = await client.query(`
            select * from orders
            where id = $1
            for update
            `, [payment.order_id])

        if (orderResult.rowCount === 0) {
            throw new AppError("Order not found", 400)
        }

        const order = orderResult.rows[0]

        if (order.status !== 'pending') {
            throw new AppError("Order already processed", 400)
        }

        if (role !== "admin" && Number(order.user_id) !== loginUserId) {
            throw new AppError("Forbidden", 403)
        }

        // payment completed
        if (newStatus === 'completed') {

            // get order items
            const itemsResult = await client.query(`
                select product_id , quantity
                from order_items
                where order_id = $1
                `, [order.id])


            const items = itemsResult.rows

            for (const item of items) {
                //lock product
                const productResult = await client.query(`
                    select stock 
                    from products
                    where id = $1
                    for update
                    `, [item.product_id])

                const product = productResult.rows[0]

                if (!product) {
                    throw new AppError("Product not found", 400)
                }

                if (product.stock < item.quantity) {
                    throw new AppError("Insufficient", 400)
                }

                // decrease stock
                await client.query(`
                    update products
                    set stock = stock - $1
                    where id = $2
                    `, [item.quantity, item.product_id])

                // stock movement
                await client.query(`
                    insert into stock_movements
                    (item_type , item_id ,quantity ,movement_type , reference_type,reference_id)
                    values('product' , $1 ,$2 ,'order' , 'order' , $3)
                    `, [item.product_id, -item.quantity, order.id])
            }

            // increase points
            if (order.earned_points > 0) {

                await client.query(`
                    insert into point_histories
                    (user_id , points , source , reference_type , reference_id)
                    values($1,$2, 'order_earn', 'order' , $3)
                    `, [order.user_id, order.earned_points, order.id])

                await client.query(`
                        update users
                        set points = points + $1
                        where id = $2
                        `, [order.earned_points, order.user_id])
            }

            // update order
            await client.query(`
                update orders
                set status = 'completed',
                    updated_at = now()
                    where id = $1
                `, [order.id])

            // update payment
            await client.query(`
                update payment
                set status = 'completed',
                    paid_at = now()
                    where id = $1
                `, [paymentId])
        }


        // cancelled payment
        if (newStatus === 'cancelled') {

            await client.query(`
                update orders
                set status = 'cancelled',
                    updated_at = now()
                    where id = $1
                `, [order.id])

            // updated payment
            await client.query(`
            update payment
            set status = 'cancelled',
                paid_at = null
            where id = $1
            `, [paymentId])
        }

        await client.query("COMMIT")


        return { paymentId, status: newStatus }
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const getPaymentByIdService = async (
    paymentId: number,
    loginUserId: number,
    role: Role
) => {

    const response = await pool.query(
        role === 'admin'
            ? `
        select 
            p. * ,
            o.user_id
        from payment p 
        join orders o on o.id = p.order_id
        where p.id = $1
        `
            :
            `
        select p.* , o.user_id
        from payment p 
        join orders o on o.id = p.order_id
        where p.id = $1
        and o.user_id = $2
        `,
        role === 'admin'
            ? [paymentId]
            : [paymentId, loginUserId]
    )

    if (response.rowCount === 0) {
        throw new AppError("Payment not found", 400)
    }

    const payment = response.rows[0]

    return payment
}

export const AdminGetPaymentDetailByIdService = async (paymentId: number) => {
    const response = await pool.query(`
        select
            p.id,
            p.order_id,
            p.amount,
            p.transaction_ref,
            p.payment_provider,
            p.status,
            p.created_at,
            p.paid_at,

            json_build_object(
            'id' , u.id,
            'first_name' , u.first_name,
            'last_name' , u.last_name,
            'email' , u.email
            ) as user
             
        from payment p 

        left join orders o
            on p.order_id = o.id
        left join users u
            on o.user_id = u.id

        where p.id =$1
        `, [paymentId])

    if (response.rowCount === 0) {
        throw new AppError("Payment not found", 404)
    }

    return response.rows[0]
}