import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import type { Redeem } from '../../type/profile/RedeemHis.type'




export default function RedeemsHistory() {

    const [redeems, setRedeems] = useState<Redeem[]>([])
    const [loading, setLoading] = useState(true)
    const [code, setCode] = useState("")

    const fetchRedeems = async () => {
        try {
            const res = await api.get('/promo-code-usages/me')
            setRedeems(res.data.data)
        } catch (err) {
            console.error('Error fetching redeems:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRedeems()
    }, [])

    const redeemCode = async () => {
        try {
            const res = await api.post('/promo-codes/redeem', {
                code
            })

            if (res.status === 200) {
                alert("Redeem Success")
                setCode("")
                fetchRedeems()
            }
        } catch (err) {
            console.error('Error redeems code:', err)
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    if (loading) {
        return <div>loading...</div>
    }



    return (
        <div className="font-baskerville">
            <div className="flex mt-6 items-center gap-6 bg-white shadow-sm max-w-2xl p-3 pl-8 rounded-xl">
                <div>
                    Redeem Code Here
                </div>
                <div>
                    <input
                        type="text"
                        placeholder='PROMO CODE'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="h-10 pl-2 border border-gray-400 rounded-xl"
                        maxLength={50}
                    />
                </div>

                <div>
                    <button
                        onClick={redeemCode}
                        className="w-25 h-9 border rounded bg-blue-500 text-white"
                    >
                        Redeem
                    </button>
                </div>
            </div>

            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm max-w-2xl mb-10 h-full">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-300 ">
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Redeem Code</th>
                            <th className="pb-3">Point</th>
                        </tr>
                    </thead>

                    <tbody>
                        {redeems.map((redeem) => (
                            <tr
                                key={redeem.id}
                                className="border-b border-gray-300 hover:bg-gray-50 transition "
                            >
                                <td className="py-4 font-medium ">
                                    {formatDate(redeem.used_at)}
                                </td>

                                <td className="py-4">
                                    <div className={`flex items-center gap-2  `}>
                                        {redeem.code}
                                    </div>
                                </td>

                                <td className="py-4 ">
                                    {redeem.points}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {redeems.length === 0 && (
                    <div className="text-center text-gray-500 mt-6 ">
                        No Redeem History
                    </div>
                )}
            </div>
        </div>
    )
}