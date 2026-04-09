import { useEffect, useState } from 'react'
import { api } from '../../../AxiosInstance'
import { useNavigate, useParams } from 'react-router-dom'
import { getStatusStyle } from '../../../components/StatusStyle'
import { formatDate } from '../../../components/FormatDate'
import { formatNumeric } from '../../../components/FormatNumeric'
import type { PaymentDetail } from '../../../type/profile/detail/paymentdetailpage.type'




export default function PaymentDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [payment, setPayment] = useState<PaymentDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchPaymentDetail = async () => {
        try {
            const { data } = await api.get(`payments/${id}`)
            setPayment(data.data)
        } catch (err) {
            console.error('Error fetching payment detail:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchPaymentDetail()
        }
    }, [id])


    if (!payment) return <div>Payment not found</div>

    const handleCancel = async () => {
        try {
            await api.patch(`/payments/${payment.id}/status`, {
                status: "cancelled"
            })

            navigate('/profile/payments')
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
                    Payment #{payment.id}
                </h2>

                <p className={`mb-2 font-baskerville ${getStatusStyle(payment.status)}`}>
                    {payment.status}
                </p>

                <p className="text-gray-500 mb-6 font-baskerville">
                    {formatDate(payment.created_at)}
                </p>

                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-3 font-baskerville">
                        <p>Provider</p>
                        <p>{payment.payment_provider}</p>
                    </div>

                    <div className="flex justify-between border-b pb-3 font-baskerville">
                        <p>Transaction</p>
                        <p>{payment.transaction_ref}</p>
                    </div>

                    <div className="flex justify-between border-b pb-3 font-baskerville">
                        <p>Amount</p>
                        <p>฿ {formatNumeric(payment.amount)}</p>
                    </div>

                    <div className="flex justify-between border-b pb-3 font-baskerville">
                        <p>Paid At</p>
                        <p>{formatDate(payment.paid_at)}</p>
                    </div>

                    <div className="flex justify-between font-baskerville">
                        <p>Order</p>
                        <button
                            onClick={() => navigate(`/profile/orders/${payment.order_id}`)}
                            className="text-blue-600 hover:underline font-baskerville"
                        >
                            #{payment.order_id}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between mt-6 font-semibold text-lg font-baskerville">

                    <p>Total</p>

                    <p>฿ {formatNumeric(payment.amount)}</p>
                </div>


                {payment.status === "pending" && (
                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Cancel Payment
                        </button>

                        <button
                            onClick={() => navigate(`/payments/${payment.order_id}`)}
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