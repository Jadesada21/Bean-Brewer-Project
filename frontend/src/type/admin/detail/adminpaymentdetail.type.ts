export interface PaymentUser {
    id: number
    first_name: string
    last_name: string
    email: string
}

export interface PaymentDetail {
    id: number
    order_id: number
    amount: number
    transaction_ref: string
    payment_provider: string
    status: string
    created_at: string
    paid_at: string
    user: PaymentUser
}