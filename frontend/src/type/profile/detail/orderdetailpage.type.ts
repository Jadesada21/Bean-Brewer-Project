export interface OrderDetail {
    order_id: number
    order_number: string
    status: string
    total_price: number
    created_at: string
    items: OrderItem[]
}

export interface OrderItem {
    product_id: number
    product_name: string
    quantity: number
    price: number
    price_per_items: number
    total_points: number
}