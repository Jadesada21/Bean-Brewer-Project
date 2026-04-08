

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../../AxiosInstance"
import { getStatusStyle } from "../../../components/StatusStyle"
import { formatDate } from "../../../components/FormatDate"
import { formatNumeric } from "../../../components/FormatNumeric"



interface PaymentUser {
    id: number
    first_name: string
    last_name: string
    email: string
}

interface PaymentDetail {
    id: number
    order_id: number
    amount: number
    transaction_ref: string
    payment_provider: string
    status: string
    created_at: string
    paid_at: string
    user: PaymentUser
}


export default function AdminPaymentDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [payment, setPayments] = useState<PaymentDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchPaymentDetail = async () => {
        try {
            const { data } = await api.get(`/admin/payments/detail/${id}`)
            setPayments(data.data)
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

    if (!payment) return <div>Order not found</div>


    if (loading) {
        return <div>loading...</div>
    }



    return (
        <div className="font-baskerville">
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">

                <h2 className="text-xl font-semibold mb-6">
                    Payment #{payment.id}
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
                        {payment.user.first_name}
                    </p>

                    <p className="my-3">
                        {payment.user.last_name}
                    </p>
                </div>


                <h2 className="text-xl font-semibold">
                    Email
                </h2>

                <p className="my-3">
                    {payment.user.email}
                </p>

                <p className="border-b pt-2"></p>

                <h2 className="text-xl font-semibold mb-2 mt-4">
                    Transaction Ref
                </h2>

                <p className="my-3">
                    {payment.transaction_ref}
                </p>

                <h2 className="text-xl font-semibold mb-2 mt-4">
                    Payment
                </h2>

                <p className="my-3">
                    {payment.payment_provider}
                </p>

                <h2 className="text-xl font-semibold mb-2 mt-4">
                    Status
                </h2>

                <p className={`mb-2 ${getStatusStyle(payment.status)}`}>
                    {payment.status}
                </p>

                <p className="text-gray-500 mb-6">
                    {formatDate(payment.created_at)}
                </p>

                <h2 className="text-xl font-semibold mb-2 mt-4">
                    Paid At
                </h2>

                <p className={`mb-2 ${getStatusStyle(payment.status)}`}>
                    {formatDate(payment.paid_at)}
                </p>

                <div className="flex justify-between">
                    <p className="text-xl font-semibold mb-2 mt-4">Order</p>
                    <button
                        onClick={() => navigate(`/admin/orders/detail/${payment.order_id}`)}
                        className="text-blue-600 hover:underline cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                    >
                        #{payment.order_id}
                    </button>
                </div>

                <div className="flex justify-between mt-6 font-semibold text-lg">
                    <p>Total</p>
                    <p>฿ {formatNumeric(payment.amount)}</p>
                </div>

                {payment.status === "pending" && (
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

