export type Status = "completed" | 'failed' | 'pending'
export type PaymentUpdateStatus = "completed" | "cancelled"

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