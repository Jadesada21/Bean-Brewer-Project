import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../AxiosInstance'

interface CartItem {
    cart_item_id: number
    product_id: number
    name: string
    image_url: string
    price: number
    quantity: number
    bag_size: string
}

interface CartContextType {
    cart: CartItem[]
    fetchCart: () => void
    addToCart: (productId: number, quantity: number) => Promise<void>
    removeItem: (cartItemId: number) => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([])

    const fetchCart = async () => {
        const res = await api.get("/carts/items")
        setCart(res.data.data)
    }
    const addToCart = async (productId: number, quantity: number) => {
        console.log({
            product_id: productId,
            quantity
        })

        await api.post("/carts/items", {
            product_id: productId,
            quantity
        })

        fetchCart()
    }

    const removeItem = async (cartItemId: number) => {

        await api.delete(`/carts/items/${cartItemId}`)
        fetchCart()
    }

    useEffect(() => {
        fetchCart()
    }, [])

    return (
        <CartContext.Provider value={{ cart, fetchCart, addToCart, removeItem }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be inside provider")
    return context
}

