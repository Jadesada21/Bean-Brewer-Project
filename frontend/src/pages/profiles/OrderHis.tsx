import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'

interface Order {
    order_id: number
    order_number: string
    status: string
    total_price: number
    created_at: string
    items: OrderItem[]
}

interface OrderItem {
    product_id: number
    name: string
    quantity: number
    price_per_items: number
    total_points: number
}

export default function OrdersHistory() {

    const navigate = useNavigate()

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/me')
            setOrders(res.data.data)
        } catch (err) {
            console.error('Error fetching orders:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    const formatPrice = (price: number) => {
        return price.toLocaleString()
    }

    if (loading) {
        return <div>loading...</div>
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "completed":
                return "text-green-600"
            case "cancelled":
                return "text-red-600"
            case "pending":
                return "text-yellow-600"
            default:
                return "text-gray-600"
        }
    }

    return (
        <div>
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-300 font-baskerville">
                            <th className="pb-3">Order</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.order_id}
                                className="border-b border-gray-300 hover:bg-gray-50 transition"
                            >
                                <td className="py-4 font-medium font-baskerville">
                                    {order.order_number}
                                </td>

                                <td className="py-4">
                                    <div className={`flex items-center gap-2 font-baskerville ${getStatusStyle(order.status)}`}>
                                        <span className={`w-2 h-2 0 rounded-full 
                                            ${order.status === 'completed'
                                                ? "bg-green-500"
                                                : order.status === 'pending'
                                                    ? "bg-yellow-500"
                                                    : order.status === 'cancelled'
                                                        ? "bg-red-500"
                                                        : "bg-gray-500"

                                            }`}></span>
                                        {order.status}
                                    </div>
                                </td>

                                <td className="py-4 font-baskerville">
                                    {formatDate(order.created_at)}
                                </td>

                                <td className="py-4 font-baskerville">
                                    ฿ {formatPrice(order.total_price)}
                                </td>

                                <td className="py-4 text-right font-baskerville">
                                    <button
                                        onClick={() => navigate(`/profile/orders/${order.order_id}`)}
                                        className="cursor-pointer bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {orders.length === 0 && (
                    <div className="text-center text-gray-500 mt-6 font-baskerville">
                        No Order History
                    </div>
                )}
            </div>
        </div>
    )
}