import { useEffect, useState } from "react"
import type { PromoCode } from "../../type/admin/adminpromocode.type"
import { api } from "../../AxiosInstance"
import axios from "axios"
import { formatNumeric } from "../../components/FormatNumeric"
import { formatDate } from "../../components/FormatDate"
import Pagination from "../../components/Pagination"
import { AdminPromoCodeModal } from "./modal/AdminPromoCodeModal"
import type { ApiError } from "../../type/apierror.type"



export default function AdminPromoCode() {

    const [loading, setLoading] = useState(true)
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
    const [search, setSearch] = useState("")
    const [error, setError] = useState("")
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)

    const limit = 10
    const totalPages = Math.ceil(total / limit)

    const fetchPromoCodes = async () => {
        try {
            const { data } = await api.get(`/admin/promo-codes?page=${page}`)
            setPromoCodes(data.data)
            setTotal(data.total)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPromoCodes()
    }, [page])

    const handleSearch = async () => {
        if (!search.trim()) {
            setPromoCodes([])
            setError("Please enter promo code")
            return
        }

        try {
            setError("")
            setLoading(true)

            const { data } = await api.get(`/admin/promo-codes/${search}`)

            setPromoCodes([data.data])
        } catch (err: unknown) {
            if (axios.isAxiosError<ApiError>(err)) {
                const status = err.response?.status
                const message = err.response?.data?.message

                if (status === 404) {
                    setPromoCodes([])
                    setError(message ?? "Promo code not found")
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

    const handleStatus = async (id: number) => {
        if (loading) return

        try {
            setLoading(true)
            await api.patch(`/admin/promo-codes/${id}`)
            fetchPromoCodes()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">
                <h1 className="text-2xl font-semibold">
                    Promo Code
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
                            placeholder="Search Promo code ID"
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

            <div className="mt-8 pl-3 mb-8">
                <AdminPromoCodeModal onSuccess={fetchPromoCodes} />
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 h-15">
                            <tr>
                                <th className="text-left pl-2">ID</th>
                                <th className="text-left pl-2">Code</th>
                                <th className="text-left pl-2">Bonus Points</th>
                                <th className="text-left pl-2">Max Usage</th>
                                <th className="text-left pl-2">Used Count</th>
                                <th className="text-left pl-2">Is Active</th>
                                <th className="text-left pl-2">Create</th>
                                <th className="text-left pl-2">Toggle Active</th>
                            </tr>
                        </thead>

                        <div className="">
                            {promoCodes.length === 0 && error && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-gray-500">
                                        Promo code not found
                                    </td>
                                </tr>
                            )}
                        </div>

                        {promoCodes.map(promocode => (

                            <tr
                                key={promocode.id}
                                className="border-t border-gray-300 ">

                                <td className="py-4 px-2">
                                    {promocode.id}
                                </td>

                                <td className="py-4 px-2">
                                    {promocode.code}
                                </td>

                                <td className="max-w-45 py-4 px-2 truncate">
                                    {formatNumeric(promocode.bonus_points)} pts
                                </td>

                                <td className="py-4 px-2 ">
                                    {formatNumeric(promocode.max_usage)}
                                </td>

                                <td className="py-4 px-2">
                                    {formatNumeric(promocode.used_count)}
                                </td>

                                <td className="py-4 px-2">
                                    {promocode.is_active ? "Active" : "Inactive"}
                                </td>

                                <td className="py-4 px-2">
                                    {formatDate(promocode.created_at)}
                                </td>

                                <td className="py-4 px-2">
                                    <button
                                        onClick={() => handleStatus(promocode.id)}
                                        className="border px-1 py-1 bg-red-400 text-white rounded-xl cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105">
                                        Switch Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
            <div className="flex gap-6 pt-4">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </div>
        </div>

    )
}