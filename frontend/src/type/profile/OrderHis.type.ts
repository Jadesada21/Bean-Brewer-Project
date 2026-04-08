export interface Order {
    order_id: number
    order_number: string
    status: string
    total_price: number
    created_at: string
    items: OrderItem[]
}

export interface OrderItem {
    product_id: number
    name: string
    quantity: number
    price_per_items: number
    total_points: number
}