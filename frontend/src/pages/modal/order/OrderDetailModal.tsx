import { useNavigate } from "react-router-dom"
import { api } from "../../../AxiosInstance"


interface OrderItem {
    product_name: string
    price: number
    quantity: number
}

interface Order {
    id: number
    status: string
    created_at: string
    total_amount: number
    items: OrderItem[]
}

interface Props {
    order: Order | null
    onClose: () => void
    onPay?: () => void
    onCancel?: () => void
}

export default function OrderDetailModal({
    order,
    onClose,
    onPay,
    onCancel
}: Props) {

    const navigate = useNavigate()
    if (!order) return null

    const subtotal = order.items?.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    ) ?? 0

    const handleCancel = async () => {
        try {

            await api.patch(`/orders/${order.id}/cancel`)

            navigate('/profile/orders')
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-125 max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Order #{order.id}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* Status */}
                <div className="mb-4 text-sm text-gray-600">
                    <p>Status: <span className="font-medium">{order.status}</span></p>
                    <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                </div>

                {/* Items */}
                <div className="border-t border-b py-4 mb-4">
                    <h3 className="font-semibold mb-3">Items</h3>

                    {order.items?.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between text-sm mb-2"
                        >
                            <div>
                                <p>{item.product_name}</p>
                                <p className="text-gray-500">
                                    {item.quantity} × {item.price} ฿
                                </p>
                            </div>

                            <p className="font-medium">
                                {item.price * item.quantity} ฿
                            </p>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Subtotal</span>
                        <span>{subtotal} ฿</span>
                    </div>

                    <div className="flex justify-between text-sm mb-1">
                        <span>Shipping</span>
                        <span>0 ฿</span>
                    </div>

                    <div className="flex justify-between font-semibold mt-2">
                        <span>Total</span>
                        <span>{order.total_amount} ฿</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">

                    <div className="gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                    {order.status === "pending" && (
                        <div className="flex gap-3 mt-6">


                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Cancel Order
                            </button>

                            <button
                                onClick={() => navigate(`/payments/${order.id}`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Pay Now
                            </button>
                        </div>
                    )}

                </div>

            </div >
        </div >
    )
}