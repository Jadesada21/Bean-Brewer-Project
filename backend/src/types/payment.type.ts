export type Status = "paid" | 'failed' | 'pending'

export interface PaymentResponse {
    id: number
    order_id: number
    amount: number
    transaction_ref: string
    paid_at: string | null
    created_at: string
    status: Status
    payment_provider: string
}


export interface PaymentInput {
    order_id: number
}