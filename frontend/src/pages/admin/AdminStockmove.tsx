import { useEffect, useState } from "react"
import { api } from "../../AxiosInstance"
import { useNavigate } from "react-router-dom"
import Pagination from "../../components/Pagination"
import { formatDate } from "../../components/FormatDate"
import { formatNumeric } from "../../components/FormatNumeric"
import type { StockmoveProps } from "../../type/admin/adminstockmove.type"
import type { ApiError } from "../../type/apierror.type"
import axios from "axios"


export default function AdminStockmove() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [stocks, setStocks] = useState<StockmoveProps[]>([])
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const limit = 10
    const totalPages = Math.ceil(total / limit)

    const fetchStockmovement = async () => {
        try {
            const { data } = await api.get(`/admin/stock_moves?page=${page}`)

            setStocks(data.data)
            setTotal(data.total)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStockmovement()
    }, [page])

    const handleSearch = async () => {
        try {
            setError("")
            setLoading(true)

            if (!search.trim()) {
                const { data } = await api.get(`/admin/stock_moves?page=1`)
                setStocks(data.data)
                setIsSearchResult(false)
                return
            }

            const { data } = await api.get(`/admin/stock_moves/${search}`)
            setStocks([data.data])
            setIsSearchResult(true)
        } catch (err: unknown) {
            if (axios.isAxiosError<ApiError>(err)) {
                const status = err.response?.status
                const message = err.response?.data?.message

                if (status === 404) {
                    setStocks([])
                    setError(message ?? "Stock not found")
                } else if (status === 400) {
                    setError(message ?? "Bad request")
                } else {
                    setError(message ?? "Something went wrong")
                }
            } else {
                setError("Unexpected Error")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleNavigate = (stock: typeof stocks[number]) => {
        if (stock.item_type === "reward") {
            navigate(`/admin/rewards/detail/${stock.item_id}`)
        } else {
            navigate(`/admin/products/detail/${stock.item_id}`)
        }
    }

    if (loading) return <div>Loading...</div>
    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">
                <h1 className="text-2xl font-semibold">
                    Stock Movement
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
                            placeholder="Search Stock Movement ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 rounded w-65"
                        />

                        <button
                            type="submit"
                            className="bg-emerald-500 text-white px-4 py-2 rounded ml-5 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>


            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 h-15">
                            <tr>
                                <th className="text-left pl-2">ID</th>
                                <th className="text-left pl-2">Type</th>
                                <th className="text-left pl-2">Item ID</th>
                                <th className="text-left pl-2">Quantity</th>
                                <th className="text-left pl-2">Movement Type</th>
                                <th className="text-left pl-2">Reference Type</th>
                                <th className="text-left pl-2">Reference ID</th>
                                <th className="text-left pl-2">Created At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stocks.length === 0 && error && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-gray-500">
                                        Stock not found
                                    </td>
                                </tr>
                            )}


                            {stocks.map(stock => (
                                <tr
                                    key={stock.id}
                                    className="border-t border-gray-300"
                                >

                                    <td className="py-4 px-2">
                                        {stock.id}
                                    </td>

                                    <td className="max-w-45 py-4 px-2 truncate">
                                        {stock.item_type}
                                    </td>

                                    <td
                                        className="py-4 px-2 text-blue-600 hover:underline cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                                        onClick={() => handleNavigate(stock)}
                                    >
                                        {stock.item_id}
                                    </td>

                                    <td className="py-4 px-2">
                                        {stock.quantity}
                                    </td>

                                    <td className="py-4 px-2">
                                        {stock.movement_type}
                                    </td>

                                    <td className="py-4 px-2 ">
                                        {stock.reference_type}
                                    </td>

                                    <td className="py-4 px-2">
                                        {formatNumeric(stock.reference_id)}
                                    </td>

                                    <td className="py-4 px-2">
                                        {formatDate(stock.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="flex gap-6 pt-4">

                    {!isSearchResult && (
                        <>
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}