import { pool } from '../db/connectPostgre.repository'
import { Role } from '../types/users.type'
import { AppError } from '../util/AppError'

import {
    PaymentResponse,
    PaymentInput
} from '../types/payment.type'

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

export const comfirmPaymentService = async (paymentId: number) => {

    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        // lock payment
        const paymentResult = await client.query(`
            select order_id , status
            from payment
            where id = $1
            for update
            `, [paymentId])

        if (paymentResult.rowCount === 0) {
            throw new AppError("Payment not found", 400)
        }

        const payment = paymentResult.rows[0]

        if (payment.status !== 'pending') {
            throw new AppError("Payment already processed", 400)
        }

        // lock order BEFORE update
        await client.query(`
            select id 
            from orders
            where id = $1
            for update
            `,
            [payment.order_id])

        // update payment
        await client.query(`
            update payment
            set status = 'paid',
            paid_at = now()
            where id = $1
            `, [paymentId])

        // update order
        await client.query(`
            update orders
            set status = 'completed'
            where id = $1
            `,
            [payment.order_id])

        await client.query("COMMIT")
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}