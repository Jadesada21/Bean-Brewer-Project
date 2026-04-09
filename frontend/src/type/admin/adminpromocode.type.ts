export interface PromoCode {
    id: number
    code: string
    bonus_points: number
    max_usage: number
    used_count: number
    is_active: boolean
    created_at: string
}