export interface Product {
    id: number
    name: string
    description: string
    price: number
    reward_points: number
    image_url: string
    roast_level: string
    category: string
    taste: string
    bag_size: string
}

export interface OrderItem {
    product_name: string
    price: number
    quantity: number
}

export interface Order {
    id: number
    status: string
    created_at: string
    total_amount: number
    items: OrderItem[]
}