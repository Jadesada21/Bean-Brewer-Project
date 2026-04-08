export interface RedeemItem {
    reward_id: number
    name: string
    quantity: number
    points_per_item: number
}

export interface RedeemUser {
    id: number
    first_name: string
    last_name: string
    email: string
}

export interface RedeemDetail {
    redeem_id: number
    redeem_number: string
    total_points_used: number
    status: string
    created_at: string
    updated_at: string
    user: RedeemUser
    items: RedeemItem[]
}
