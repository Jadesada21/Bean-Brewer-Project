export interface Order {
    id: number
    user_id: number
    order_number: number
    total_price: number
    earned_points: number
    created_at: string
    updated_at: string
    status: string
}