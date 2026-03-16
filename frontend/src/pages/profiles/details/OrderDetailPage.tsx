import { useEffect, useState } from 'react'
import { api } from '../../../AxiosInstance'
import { useParams, useNavigate } from 'react-router-dom'

interface OrderDetail {
    order_id: number
    order_number: string
    status: string
    total_price: number
    created_at: string
    items: OrderItem[]
}

interface OrderItem {
    product_id: number
    product_name: string
    quantity: number
    price: number
    price_per_items: number
    total_points: number
}

export default function OrderDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchOrderDetail = async () => {
        try {
            const { data } = await api.get(`orders/${id}`)
            setOrder(data.data)
        } catch (err) {
            console.error('Error fetching order detail:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchOrderDetail()
        }
    }, [id])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    const formatPrice = (price: number) => {
        return price.toLocaleString()
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

    if (!order) return <div>Order not found</div>

    const handleCancel = async () => {
        try {
            await api.patch(`/orders/${order.order_id}/cancel`)

            navigate('/profile/orders')
        } catch (err) {

        }
    }

    if (loading) {
        return <div>loading...</div>
    }




    return (
        <div>
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">
                <h2 className="text-xl font-semibold mb-4 font-baskerville">
                    {order.order_number}
                </h2>

                <p className={`mb-2 font-baskerville ${getStatusStyle(order.status)}`}>
                    {order.status}
                </p>

                <p className="text-gray-500 mb-6 font-baskerville">
                    {formatDate(order.created_at)}
                </p>

                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div
                            key={item.product_id}
                            className="flex justify-between border-b pb-3 font-baskerville"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.product_name}
                                </p>

                                <p className="text-sm text-gray-500 font-baskerville">
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <p className="font-medium font-baskerville">
                                ฿ {formatPrice(item.price)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-6 font-semibold text-lg font-baskerville">

                    <p>Total</p>

                    <p>฿ {formatPrice(order.total_price)}</p>
                </div>

                {order.status === "pending" && (
                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Cancel Order
                        </button>

                        <button
                            onClick={() => navigate(`/payments/${order.order_id}`)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Pay Now
                        </button>

                    </div>
                )}

            </div>
        </div>
    )
}