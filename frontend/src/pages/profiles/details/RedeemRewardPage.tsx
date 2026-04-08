import { useEffect, useState } from 'react'
import { api } from '../../../AxiosInstance'
import { useParams, useNavigate } from 'react-router-dom'
import type { RedeemDetail } from '../../../type/profile/detail/RedeemRewardPage.type'




export default function RedeemRewardDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [redeem, setRedeem] = useState<RedeemDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchRedeemDetail = async () => {
        try {
            const { data } = await api.get(`redeems/${id}`)
            setRedeem(data.data)
        } catch (err) {
            console.error('Error fetching order detail:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchRedeemDetail()
        }
    }, [id])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    const formatPoints = (point: number) => {
        return point.toLocaleString()
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

    if (!redeem) return <div>Redeem not found</div>

    const handleCancel = async () => {
        try {
            await api.patch(`/redeems/${redeem.redeem_id}/status`, {
                status: "cancelled"
            })

            navigate('/profile/rewards-redeem')
        } catch (err) {

        }
    }

    const handleRedeemNow = async () => {
        try {

            await api.patch(`/redeems/${redeem.redeem_id}/status`, {
                status: "completed"
            })

            navigate('/profile/rewards-redeem')
        } catch (err) {
            console.log(err)
        }
    }

    if (loading) {
        return <div>loading...</div>
    }




    return (
        <div>
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-3xl mb-10 h-full">
                <h2 className="text-xl font-semibold mb-4 font-baskerville">
                    Redeem {redeem.redeem_number}
                </h2>

                <p className={`mb-2 font-baskerville ${getStatusStyle(redeem.status)}`}>
                    {redeem.status}
                </p>

                <p className="text-gray-500 mb-6 font-baskerville">
                    {formatDate(redeem.created_at)}
                </p>

                <div className="space-y-4">
                    {redeem.items.map((item) => (
                        <div
                            key={item.reward_id}
                            className="flex justify-between border-b pb-3 font-baskerville"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.reward_name}
                                </p>

                                <p className="text-sm text-gray-500 font-baskerville pt-2">
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <p className="font-medium font-baskerville">
                                {formatPoints(item.points_per_item)} pts
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-6 font-semibold text-lg font-baskerville">

                    <p>Total</p>

                    <p>{formatPoints(redeem.total_points_used)} pts</p>
                </div>

                {redeem.status === "pending" && (
                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Cancel Redeem
                        </button>

                        <button
                            onClick={handleRedeemNow}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Redeem Now
                        </button>

                    </div>
                )}

            </div>
        </div>
    )
}