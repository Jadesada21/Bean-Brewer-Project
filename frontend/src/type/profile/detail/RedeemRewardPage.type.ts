export interface RedeemDetail {
    redeem_id: number
    redeem_number: string
    status: string
    total_points_used: number
    created_at: string
    items: RedeemItem[]
}

export interface RedeemItem {
    reward_id: number
    reward_name: string
    quantity: number
    points_per_item: number
    total_points_used: number
}