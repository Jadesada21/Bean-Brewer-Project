import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import type { Points } from '../../type/profile/pointhis.type'



export default function PointsHistory() {

    const [points, setPoints] = useState<Points[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPoints = async () => {
        try {
            const res = await api.get('/point-histories/users/me')
            setPoints(res.data.data)
        } catch (err) {
            console.error('Error fetching points:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPoints()
    }, [])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    if (loading) {
        return <div>loading...</div>
    }



    return (
        <div>
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm w-125 mb-10 h-full">

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-300 font-baskerville">
                            <th className="pb-3">Date</th>
                            <th className="pb-3 pr-4">Points</th>
                            <th className="pb-3">Reference Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        {points.map((point) => (
                            <tr
                                key={point.id}
                                className="border-b border-gray-300 hover:bg-gray-50 transition"
                            >
                                <td className="py-4 font-medium font-baskerville">
                                    {formatDate(point.created_at)}
                                </td>

                                <td className="py-4">
                                    <div className={`flex items-center gap-2  font-baskerville`}>
                                        {point.points}
                                    </div>
                                </td>

                                <td className="py-4 font-baskerville">
                                    {point.reference_type}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {points.length === 0 && (
                    <div className="text-center text-gray-500 mt-6 font-baskerville">
                        No Points History
                    </div>
                )}
            </div>
        </div>
    )
}