export interface PaymentDetail {
    id: number
    order_id: number
    amount: number
    status: string
    transaction_ref: string
    created_at: string
    paid_at: string
    payment_provider: string
}