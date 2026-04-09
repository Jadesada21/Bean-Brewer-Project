export interface Reward {
    id: number
    name: string
    description: string
    short_description?: string
    points_required: number
    image_url: string
    category: string
}

export interface redeemItem {
    reward_name: string
    points_required: number
    quantity: number
}

export interface Redeem {
    id: number
    status: string
    created_at: string
    total_points_used: number
    items: redeemItem[]
}