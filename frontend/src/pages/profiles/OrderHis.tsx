import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import type { Order } from '../../type/profile/orderhis.type'




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
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-230 mb-10 h-full">

                {/* ✅ MOBILE (card) */}
                <div className="md:hidden space-y-4">
                    {orders.map((order) => (
                        <div key={order.order_id} className="border rounded-lg p-4">

                            {/* row 1 */}
                            <div className="flex justify-between items-center">
                                <span className="font-medium font-baskerville">
                                    {order.order_number}
                                </span>

                                <div className={`flex items-center gap-2 font-baskerville ${getStatusStyle(order.status)}`}>
                                    <span className={`w-2 h-2 rounded-full 
                                ${order.status === 'completed'
                                            ? "bg-green-500"
                                            : order.status === 'pending'
                                                ? "bg-yellow-500"
                                                : order.status === 'cancelled'
                                                    ? "bg-red-500"
                                                    : "bg-gray-500"
                                        }`}>
                                    </span>
                                    {order.status}
                                </div>
                            </div>

                            {/* row 2 */}
                            <div className="flex justify-between text-sm text-gray-600 mt-2 font-baskerville">
                                <span>{formatDate(order.created_at)}</span>
                                <span>฿ {formatPrice(order.total_price)}</span>
                            </div>

                            {/* button */}
                            <button
                                onClick={() => navigate(`/profile/orders/${order.order_id}`)}
                                className="mt-3 w-full bg-emerald-500 text-white py-2 rounded-md text-sm
                        transition-all duration-150 active:scale-90 hover:scale-105"
                            >
                                View Details
                            </button>

                        </div>
                    ))}
                </div>

                <div className="hidden md:block">
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
                                            className="cursor-pointer bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-all duration-150 active:scale-90 hover:scale-105">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="text-center text-gray-500 mt-6 font-baskerville">
                        No Order History
                    </div>
                )}


            </div>
        </div>
    )
}