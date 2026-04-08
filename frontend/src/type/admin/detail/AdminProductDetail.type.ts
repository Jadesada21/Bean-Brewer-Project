export interface ProductDetail {
    id: number
    name: string
    price: number
    stock: number
    description: string
    reward_points: number
    taste: string
    roast_level: string
    bag_size: string
    category_id: number
    is_active: boolean
    created_at: string
    updated_at: string
    category_name: string
    category_type: string

    images?: ProductImage[]
    total_images: number
}

export interface ProductImage {
    id: number
    image_url?: string
    is_primary: boolean
}