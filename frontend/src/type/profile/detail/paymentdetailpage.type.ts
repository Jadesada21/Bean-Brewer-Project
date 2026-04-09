export interface PaymentDetail {
    id: number
    order_id: number
    amount: number
    transaction_ref: string
    created_at: string
    payment_provider: string
    paid_at: string
    status: string
    user_id: number
}