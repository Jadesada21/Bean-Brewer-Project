

export interface RewardImageResponse {
    id: number
    reward_id: number
    image_url: string
    public_id: string
    is_primary: boolean
    sort_order: number
    created_at: string
    updated_at: string
}

export interface RewardImageMetaInput {
    is_primary?: boolean
    sort_order?: number
}

export interface DeleteRewardImagesInput {
    image_ids: number[]
}

export interface setPrimaryImageInput {
    image_id: number
}

export interface setSortOrderImageInput {
    image_ids: number[]
}

export interface UploadImageBody {
    imagesMeta?: RewardImageMetaInput[]
}