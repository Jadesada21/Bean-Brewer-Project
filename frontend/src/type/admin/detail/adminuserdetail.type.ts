export interface UserDetail {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    phone_num: string
    role: string
    is_active: boolean
    points: number
    created_at: string
    updated_at: string

    addresses: UserAddressDetail[]
}

interface UserAddressDetail {
    id: number
    user_id: number
    address_line: string
    province: string
    country: string
    district: string
    subdistrict: string
    postal_code: string
    is_default: boolean
    created_at: string
    updated_at: string
}