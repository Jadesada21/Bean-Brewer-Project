export interface OrderItem {
    product_name: string
    price: number
    quantity: number
    image_url: string
}

export interface Order {
    order_id: number
    order_number: string
    status: string
    total_price: number
    payment_id: number
    items: OrderItem[]
}

export interface UserInfo {
    email: string
    phone_num: string
    address_line: string
    province: string
    district: string
    subdistrict: string
}

export interface AddressInfo {
    address_line: string
    province: string
    postal_code: string
    country: string
    district: string
    subdistrict: string
}