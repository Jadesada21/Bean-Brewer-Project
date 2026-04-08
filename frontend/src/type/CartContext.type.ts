export interface CartItem {
    cart_item_id: number
    product_id: number
    name: string
    image_url: string
    price: number
    quantity: number
    bag_size: string
}

export interface CartContextType {
    cart: CartItem[]
    fetchCart: () => void
    addToCart: (productId: number, quantity: number) => Promise<void>
    removeItem: (cartItemId: number) => Promise<void>
    checkout: () => Promise<void>
}