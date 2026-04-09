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

export interface Props {
    redeem: Redeem | null
    onClose: () => void
    onRedeem?: () => void
    onCancel?: () => void
}