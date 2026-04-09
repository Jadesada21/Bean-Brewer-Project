export interface Payment {
    id: number
    order_number: string
    amount: number
    transaction_ref: string
    created_at: string
    paid_at: string
    status: string
}