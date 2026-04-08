export interface OrderItem {
    product_name: string
    price: number
    quantity: number
}

export interface Order {
    id: number
    status: string
    created_at: string
    total_amount: number
    items: OrderItem[]
}

export interface Props {
    order: Order | null
    onClose: () => void
    onPay?: () => void
    onCancel?: () => void
}