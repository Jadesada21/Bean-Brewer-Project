import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../AxiosInstance'
import { useAuth } from './AuthContext'
import type { CartContextType, CartItem } from '../type/CartContext.type'



const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([])
    const { user } = useAuth()

    const fetchCart = async () => {
        const res = await api.get("/carts/items")
        setCart(res.data.data)
    }
    const addToCart = async (productId: number, quantity: number) => {
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
        if (user) {
            fetchCart()

        }
    }, [user])

    const checkout = async () => {
        try {
            const res = await api.post('/orders/checkout')
            return res.data.data.id
        } catch (err: any) {
            throw err
        }
    }

    return (
        <CartContext.Provider value={{ cart, fetchCart, addToCart, removeItem, checkout }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be inside provider")
    return context
}

