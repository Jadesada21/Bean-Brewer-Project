import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'

interface Order {
    id: number
    user_id: number
    order_number: number
    total_price: number
    earned_points: number
    created_at: string
    updated_at: string
    status: string
}

export default function AdminProduct() {

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [error, setError] = useState("")

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/admin/orders?page=${page}`)
            setOrders(res.data.data)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [page])

    const handleSearch = async () => {
        try {
            setError("")

            if (!search.trim()) {
                const res = await api.get('admin/orders?page=1')
                setOrders(res.data.data)
                return
            }

            const res = await api.get(`/admin/orders/${search}`)

            setOrders([res.data.data])
        } catch (err: any) {

            if (err.response?.status === 404) {
                setOrders([])
                setError("Order not found")
            }
        }


    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">

                <h1 className="text-2xl font-semibold">
                    Orders
                </h1>

                <div>
                    <input
                        type="text"
                        placeholder="Search Order ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded"
                    />

                    <button
                        onClick={handleSearch}
                        className="bg-emerald-500 text-white px-4 py-2 rounded ml-5"
                    >
                        Search
                    </button>
                </div>
            </div>



            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100 h-15">
                        <tr>
                            <th className="text-left pl-2">Order ID</th>
                            <th className="text-left pl-2">User ID</th>
                            <th className="text-left pl-2">Order Number</th>
                            <th className="text-left pl-2">Price</th>
                            <th className="text-left pl-2">Point</th>
                            <th className="text-left pl-2">Status</th>
                            <th className="text-left pl-2">Create</th>
                            <th className="text-left pl-2">Update</th>
                        </tr>
                    </thead>

                    <tbody>

                        {orders.length === 0 && error && (
                            <tr>
                                <td colSpan={3} className="p-6 text-gray-500">
                                    Order not found
                                </td>
                            </tr>
                        )}

                        {orders.map(order => (

                            <tr key={order.id} className="border-t">

                                <td className="p-4 ">
                                    {order.id}
                                </td>

                                <td className="p-4">
                                    {order.user_id}
                                </td>

                                <td className="p-4 w-45">
                                    {order.order_number}
                                </td>

                                <td className="p-4 w-">
                                    ฿ {order.total_price}
                                </td>

                                <td className="p-4">
                                    {order.earned_points} pts
                                </td>

                                <td className="p-4">
                                    {order.status}
                                </td>

                                <td className="p-4">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>

                                <td className="p-4">
                                    {new Date(order.updated_at).toLocaleDateString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <div className="flex gamt-6 pt-4">

                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Prev
                </button>

                <span className="px-4 py-2">
                    Page {page}
                </span>

                <button
                    onClick={() => setPage(prev => prev + 1)}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Next
                </button>

            </div>


        </div>
    )
}