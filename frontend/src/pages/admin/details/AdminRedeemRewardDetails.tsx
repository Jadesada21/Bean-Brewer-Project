import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../../AxiosInstance"
import { formatDate } from "../../../components/FormatDate"
import { getStatusStyle } from "../../../components/StatusStyle"
import { formatNumeric } from "../../../components/FormatNumeric"
import type { RedeemDetail } from "../../../type/admin/detail/adminredeemrewarddetail.type"


export default function AdminRedeemRewardDetails() {
    const { id } = useParams()

    const navigate = useNavigate()

    const [redeem, setRedeem] = useState<RedeemDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchRedeemRewardDetail = async () => {
        try {
            const { data } = await api.get(`/admin/redeems/detail/${id}`)
            setRedeem(data.data)
            console.log(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchRedeemRewardDetail()
        }
    }, [id])

    if (!redeem) return <div>Redeem reward not found</div>

    if (loading) return <div>Loading...</div>
    return (
        <div className="font-baskerville ml-30">
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">

                <h2 className="text-xl font-semibold mb-6">
                    {redeem.redeem_number}
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
                        {redeem.user.first_name}
                    </p>

                    <p className="my-3">
                        {redeem.user.last_name}
                    </p>
                </div>


                <h2 className="text-xl font-semibold">
                    Email
                </h2>

                <p className="my-3">
                    {redeem.user.email}
                </p>

                <h2 className="text-xl font-semibold mb-2 mt-4">
                    Product
                </h2>

                <div className="my-3">
                    {redeem.items.map((item) => (
                        <div key={item.reward_id}>
                            <p className="my-3">
                                {item.name}
                            </p>
                        </div>
                    ))}
                </div>

                <h2 className="text-xl font-semibold mb-2 mt-4">
                    Status
                </h2>

                <p className={`mb-2 ${getStatusStyle(redeem.status)}`}>
                    {redeem.status}
                </p>

                <p className="text-gray-500 mb-6">
                    {formatDate(redeem.created_at)}
                </p>

                <div className="space-y-4">
                    {redeem.items.map((item) => (
                        <div
                            key={item.reward_id}
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
                                {formatNumeric(item.points_per_item)} pts.
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-6 font-semibold text-lg">

                    <p>Total</p>

                    <p>{formatNumeric(redeem.total_points_used)} pts.</p>
                </div>

                {redeem.status === "pending" && (
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