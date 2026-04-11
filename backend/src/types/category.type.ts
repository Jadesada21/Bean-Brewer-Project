export type CategoryType = "product" | "reward"

export interface CategoryResponse {
    id: number
    name: string
    parent_id: number | null
    type: CategoryType
    created_at: string
    updated_at: string
}

export interface CreateCategoryInput {
    name: string
    parent_id?: number | null
    type: CategoryType
}

export interface UpdateCategoriesInput {
    name: string
    type: "product" | "reward"
}