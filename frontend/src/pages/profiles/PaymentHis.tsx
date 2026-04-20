import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import type { Payment } from '../../type/profile/paymenthis.type'
import Pagination from '../../components/Pagination'



export default function PaymentHistory() {

    const navigate = useNavigate()

    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const limit = 10
    const totalPages = Math.ceil(total / limit)

    const fetchPayment = async () => {
        try {
            const { data } = await api.get('/payments/me', {
                params: {
                    page
                }
            })
            setPayments(data.payment)
            setTotal(data.total)
        } catch (err) {
            console.error('Error fetching payments:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayment()
    }, [page])

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

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div className="font-baskerville">
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-230 mb-10 h-full">

                {/* ✅ MOBILE (card) */}
                <div className="md:hidden space-y-4">
                    {payments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">

                            {/* row 1 */}
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    {payment.transaction_ref}
                                </span>

                                <div className={`flex items-center gap-2 ${getStatusStyle(payment.status)}`}>
                                    <span className={`w-2 h-2 rounded-full 
                                ${payment.status === 'completed'
                                            ? "bg-green-500"
                                            : payment.status === 'pending'
                                                ? "bg-yellow-500"
                                                : payment.status === 'cancelled'
                                                    ? "bg-red-500"
                                                    : "bg-gray-500"
                                        }`}>
                                    </span>
                                    {payment.status}
                                </div>
                            </div>

                            {/* row 2 */}
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <span>{formatDate(payment.paid_at)}</span>
                                <span>฿ {formatPrice(payment.amount)}</span>
                            </div>

                            {/* button */}
                            <button
                                onClick={() => navigate(`/profile/payments/${payment.id}`)}
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
                            <tr className="text-left text-gray-500 border-b border-gray-300">
                                <th className="pb-3">Payment Order</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3 pr-4">Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="border-b border-gray-300 hover:bg-gray-50 transition"
                                >
                                    <td className="py-4 font-medium">
                                        {payment.transaction_ref}
                                    </td>

                                    <td className="py-4">
                                        <div className={`flex items-center gap-2 ${getStatusStyle(payment.status)}`}>
                                            <span className={`w-2 h-2 rounded-full 
                                        ${payment.status === 'completed'
                                                    ? "bg-green-500"
                                                    : payment.status === 'pending'
                                                        ? "bg-yellow-500"
                                                        : payment.status === 'cancelled'
                                                            ? "bg-red-500"
                                                            : "bg-gray-500"
                                                }`}></span>
                                            {payment.status}
                                        </div>
                                    </td>

                                    <td className="py-4">
                                        {formatDate(payment.paid_at)}
                                    </td>

                                    <td className="py-4">
                                        ฿ {formatPrice(payment.amount)}
                                    </td>

                                    <td className="py-4 ">
                                        <button
                                            onClick={() => navigate(`/profile/payments/${payment.id}`)}
                                            className="cursor-pointer
                                         bg-emerald-500 text-white px-4 
                                         py-2 rounded-md hover:bg-emerald-600
                                         transition-all duration-150 active:scale-90 hover:scale-105">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {payments.length === 0 && (
                    <div className="text-center text-gray-500 mt-6">
                        No payment history
                    </div>
                )}
            </div>
            <div className="mt-12 flex justify-center mb-10">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </div>
        </div>
    )
}