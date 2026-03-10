import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'

interface Payment {
    id: number
    order_number: string
    amount: number
    transaction_ref: string
    created_at: string
    paid_at: string
    status: string
}

export default function PaymentHistory() {

    const navigate = useNavigate()

    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPayment = async () => {
        try {
            const res = await api.get('/payments/me')
            setPayments(res.data.payment)
        } catch (err) {
            console.error('Error fetching payments:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayment()
    }, [])

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
        <div>
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-230 mb-10 h-full">

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-300">
                            <th className="pb-3">Order</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3 pr-4">Amount</th>
                            <th className="pb-3">transaction</th>
                        </tr>
                    </thead>

                    <tbody>
                        {payments.map((payment) => (
                            <tr
                                key={payment.id}
                                className="border-b border-gray-300 hover:bg-gray-50 transition"
                            >
                                <td className="py-4 font-medium font-baskerville">
                                    {payment.order_number}
                                </td>

                                <td className="py-4">
                                    <div className={`flex items-center gap-2 font-baskerville ${getStatusStyle(payment.status)}`}>
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

                                <td className="py-4 font-baskerville">
                                    {formatDate(payment.paid_at)}
                                </td>

                                <td className="py-4 font-baskerville">
                                    ฿ {formatPrice(payment.amount)}
                                </td>


                                <td className="py-4 font-baskerville">
                                    {payment.transaction_ref}
                                </td>

                                <td className="py-4 text-right font-baskerville">
                                    <button
                                        onClick={() => navigate(`/profile/payments/${payment.id}`)}
                                        className="cursor-pointer bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {payments.length === 0 && (
                    <div className="text-center text-gray-500 mt-6 font-baskerville">
                        No payment history
                    </div>
                )}
            </div>
        </div>
    )
}