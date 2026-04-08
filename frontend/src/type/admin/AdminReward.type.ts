export interface Reward {
    id: number
    name: number
    description: string
    short_description: string
    points_required: number
    stock: number
    category_id: number
    is_active: boolean
    total_images: number
    created_at: string
    updated_at: string
    image_urls: string[]
}