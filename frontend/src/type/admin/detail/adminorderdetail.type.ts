export interface OrderItem {
    product_id: number
    name: string
    quantity: string
    price_per_items: number
    total_points: number
}

export interface OrderUser {
    id: number
    first_name: string
    last_name: string
    email: string
}

export interface OrderDetail {
    order_id: number
    order_number: number
    status: string
    total_price: number
    earned_points: number
    created_at: string
    user: OrderUser
    items: OrderItem[]
}