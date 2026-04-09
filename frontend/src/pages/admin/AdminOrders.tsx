import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import { formatDate } from '../../components/FormatDate'
import type { Order } from '../../type/admin/adminorder.type'



export default function AdminOrder() {

    const navigate = useNavigate()

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [error, setError] = useState("")
    const [total, setTotal] = useState(0)


    const limit = 10
    const totalPages = Math.ceil(total / limit)

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/admin/orders?page=${page}`)
            setOrders(res.data.data)
            setTotal(res.data.total)

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
                const res = await api.get('/admin/orders?page=1')
                setOrders(res.data.data)
                setIsSearchResult(false)
                return
            }

            const res = await api.get(`/admin/orders/${search}`)

            setOrders([res.data.data])
            setIsSearchResult(true)
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

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSearch()
                    }}
                >
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
                            className="bg-emerald-500 text-white px-4 py-2 rounded ml-5 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Search
                        </button>
                    </div>
                </form>
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
                                <td colSpan={8} className="p-6 text-gray-500">
                                    Order not found
                                </td>
                            </tr>
                        )}

                        {orders.map(order => (

                            <tr
                                key={order.id}
                                className="border-t border-gray-300 transition-all duration-100 hover:shadow-xl cursor-pointer "
                                onClick={() => navigate(`/admin/orders/detail/${order.id}`)}
                            >

                                <td className="pl-2 py-4">
                                    {order.id}
                                </td>

                                <td className="pl-2 py-4">
                                    {order.user_id}
                                </td>

                                <td className="pl-2 py-4 w-45">
                                    {order.order_number}
                                </td>

                                <td className="pl-2 py-4 w-">
                                    ฿ {order.total_price}
                                </td>

                                <td className="pl-2 py-4">
                                    {order.earned_points} pts
                                </td>

                                <td className="pl-2 py-4">
                                    {order.status}
                                </td>

                                <td className="pl-2 py-4">
                                    {formatDate(order.created_at)}

                                </td>

                                <td className="pl-2 py-4">
                                    {formatDate(order.updated_at)}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <div className="flex justify-between">

                {isSearchResult && orders.length > 0 && (
                    <button
                        onClick={() => navigate(`/admin/orders/detail/${orders[0].id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-4"
                    >
                        view Details
                    </button>



                )}
                <div className="pt-4">

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>

        </div>
    )
}