import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'

interface Redeem {
    id: number
    code: string
    points: number
    used_at: string
}


export default function RedeemsHistory() {

    const [redeems, setRedeems] = useState<Redeem[]>([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const res = await api.get('/promo-code-usages/me')
            setRedeems(res.data.data)
        } catch (err) {
            console.error('Error fetching orders:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    if (loading) {
        return <div>loading...</div>
    }



    return (
        <div>
            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-2xl mb-10 h-full">

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-300 font-baskerville">
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Redeem Code</th>
                            <th className="pb-3">Point</th>
                        </tr>
                    </thead>

                    <tbody>
                        {redeems.map((redeem) => (
                            <tr
                                key={redeem.id}
                                className="border-b border-gray-300 hover:bg-gray-50 transition font-baskerville"
                            >
                                <td className="py-4 font-medium font-baskerville">
                                    {formatDate(redeem.used_at)}
                                </td>

                                <td className="py-4">
                                    <div className={`flex items-center gap-2  font-baskerville`}>
                                        {redeem.code}
                                    </div>
                                </td>

                                <td className="py-4 font-baskerville">
                                    {redeem.points}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {redeems.length === 0 && (
                    <div className="text-center text-gray-500 mt-6 font-baskerville">
                        No Redeem History
                    </div>
                )}
            </div>
        </div>
    )
}