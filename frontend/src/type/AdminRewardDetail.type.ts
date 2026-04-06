export interface RewardsDetail {
    id: number
    name: string
    description: string
    short_description: string
    points_required: number
    stock: number
    category_id: number
    is_active: boolean
    created_at: string
    updated_at: string

    category_name: string
    category_type: string

    images?: RewardImage[]
    total_images: number
}

export interface RewardImage {
    id: number
    image_url?: string
    is_primary: boolean
}
