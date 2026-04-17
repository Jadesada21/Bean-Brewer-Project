import { useEffect, useState } from "react"
import { api } from "../../AxiosInstance"
import { useNavigate } from "react-router-dom"
import { formatNumeric } from "../../components/FormatNumeric"
import { formatDate } from "../../components/FormatDate"
import Pagination from "../../components/Pagination"
import axios from "axios"
import type { PaymentDetail } from "../../type/admin/adminpayment.type"
import type { ApiError } from "../../type/apierror.type"



export default function AdminPayment() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [payments, setPayments] = useState<PaymentDetail[]>([])
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const limit = 10
    const totalPages = Math.ceil(total / limit)

    const fetchPayment = async () => {
        try {
            const { data } = await api.get(`/admin/payments`)
            setPayments(data.data)
            setTotal(data.total)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayment()
    }, [page])

    const handleSearch = async () => {
        try {
            setError("")

            if (!search.trim()) {
                const { data } = await api.get(`/admin/payments?page=1`)
                setPayments(data.data)
                setIsSearchResult(false)
                return
            }

            const { data } = await api.get(`/admin/payments/${search}`)
            setPayments([data.data])
            setIsSearchResult(true)

        } catch (err: unknown) {
            if (axios.isAxiosError<ApiError>(err)) {
                const status = err.response?.status
                const message = err.request?.data?.message

                if (status === 404) {
                    setPayments([])
                    setError(message ?? "Payment not found")
                } else if (status === 400) {
                    setError(message ?? "Bad request")
                } else {
                    setError(message ?? "Something went wrong")
                }
            } else {
                setError("Unexpected error")
            }
        }
    }

    if (loading) return <div>Loading...</div>
    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">
                <h1 className="text-2xl font-semibold">
                    Payments
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
                            placeholder="Search Payment ID"
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

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 h-15">
                            <tr>
                                <th className="text-left pl-2">ID</th>
                                <th className="text-left pl-2">Order ID</th>
                                <th className="text-left pl-2">Transaction Ref</th>
                                <th className="text-left pl-2">Payment Provider</th>
                                <th className="text-left pl-2">Status</th>
                                <th className="text-left pl-2">Amount</th>
                                <th className="text-left pl-2">Created At</th>
                                <th className="text-left pl-2">Paid At</th>
                            </tr>
                        </thead>

                        <div className="">
                            {payments.length === 0 && error && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-gray-500">
                                        Payments not found
                                    </td>
                                </tr>
                            )}
                        </div>

                        {payments.map(payment => (

                            <tr
                                key={payment.id}
                                className="border-t border-gray-300 transition-all duration-100 hover:shadow-xl cursor-pointer  "
                                onClick={() => navigate(`/admin/payments/detail/${payment.id}`)}
                            >

                                <td className="py-4 px-2">
                                    {payment.id}
                                </td>

                                <td className="max-w-45 py-4 px-2 truncate">
                                    {payment.order_id}
                                </td>

                                <td className="py-4 px-2">
                                    {payment.transaction_ref}
                                </td>

                                <td className="py-4 px-2">
                                    {payment.payment_provider}
                                </td>

                                <td className="py-4 px-2">
                                    {payment.status}
                                </td>

                                <td className="py-4 px-2 ">
                                    ฿ {formatNumeric(payment.amount)}
                                </td>

                                <td className="py-4 px-2">
                                    {formatDate(payment.created_at)}
                                </td>

                                <td className="py-4 px-2">
                                    {formatDate(payment.paid_at)}
                                </td>

                            </tr>
                        ))}
                    </table>
                </div>
            </div>
            <div className="flex justify-between">
                {isSearchResult && payments.length > 0 && (
                    <button
                        onClick={() => navigate(`/admin/payments/detail/${payments[0].id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-4"
                    >
                        view Details
                    </button>
                )}
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