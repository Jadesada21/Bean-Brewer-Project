import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../../AxiosInstance"
import { getStatusStyle } from "../../../components/StatusStyle"
import { formatDate } from "../../../components/FormatDate"
import { formatNumeric } from "../../../components/FormatNumeric"
import type { OrderDetail } from "../../../type/admin/detail/adminorderdetail.type"





export default function AdminOrderDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchOrderDetail = async () => {
        try {
            const { data } = await api.get(`/admin/orders/detail/${id}`)
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

    if (!order) return <div>Order not found</div>


    if (loading) {
        return <div>loading...</div>
    }



    return (
        <div className="font-baskerville">
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">

                <h2 className="text-xl font-semibold mb-6">
                    {order.order_number}
                </h2>

                <div className="grid grid-cols-[160px_160px]">
                    <h2 className="text-xl font-semibold">
                        Username
                    </h2>



                    <h2 className="text-xl font-semibold">
                        Lastname
                    </h2>
                </div>

                <div className="grid grid-cols-[160px_160px]">
                    <p className="my-3">
                        {order.user.first_name}
                    </p>

                    <p className="my-3">
                        {order.user.last_name}
                    </p>
                </div>


                <h2 className="text-xl font-semibold">
                    Email
                </h2>

                <p className="my-3">
                    {order.user.email}
                </p>

                <h2 className="text-xl font-semibold mb-2 mt-4">
                    Product
                </h2>

                <div className="my-3">
                    {order.items.map((item) => (
                        <div key={item.product_id}>
                            <p className="my-3">
                                {item.name}
                            </p>
                        </div>
                    ))}
                </div>

                <h2 className="text-xl font-semibold mb-2 mt-4">
                    Status
                </h2>

                <p className={`mb-2 ${getStatusStyle(order.status)}`}>
                    {order.status}
                </p>

                <p className="text-gray-500 mb-6">
                    {formatDate(order.created_at)}
                </p>

                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div
                            key={item.product_id}
                            className="flex justify-between border-b pb-3"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <p className="font-medium">
                                ฿ {formatNumeric(item.price_per_items)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-6 font-semibold text-lg">

                    <p>Total</p>

                    <p>฿ {formatNumeric(order.total_price)}</p>
                </div>

                {order.status === "pending" && (
                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            onClick={() => navigate("/admin/orders")}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

