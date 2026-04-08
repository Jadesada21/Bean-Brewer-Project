import { useEffect, useState } from "react"
import { api } from "../../AxiosInstance"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../components/FormatDate"
import Pagination from "../../components/Pagination"

interface RedeemRewardsProps {
    id: number
    user_id: number
    total_points_used: number
    created_at: string
    redeem_number: string
    updated_at: string
    status: string
}

export default function AdminRedeemRewards() {

    const navigate = useNavigate()

    const [redeemRewards, setRedeemRewards] = useState<RedeemRewardsProps[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [error, setErorr] = useState("")
    const [search, setSearch] = useState("")
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [loading, setLoading] = useState(true)

    const limit = 10
    const totalPages = Math.ceil(total / limit)

    const fetchRedeemRewards = async () => {
        try {
            const res = await api.get(`/admin/redeems`)

            setRedeemRewards(res.data.data)
            setTotal(res.data.total)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRedeemRewards()
    }, [page])

    const handleSearch = async () => {
        try {
            setErorr("")

            if (!search.trim()) {
                const res = await api.get(`/admin/redeems?page=1`)
                setRedeemRewards(res.data.data)
                setIsSearchResult(false)
                return
            }

            const res = await api.get(`/admin/redeems/${search}`)
            setRedeemRewards(res.data.data)
            setIsSearchResult(true)
        } catch (err: any) {
            if (err.response?.status === 404) {
                setRedeemRewards([])
                setErorr("Redeem reward not found")
            }
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">

                <h1 className="text-2xl font-semibold">
                    Redeem Rewards
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
                            placeholder="Search Redeem Rewards ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 rounded w-70"
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

                <table className="w-full">

                    <thead className="bg-gray-100 h-15">
                        <tr>
                            <th className="text-left pl-2">Redeem Reward ID</th>
                            <th className="text-left pl-2">User ID</th>
                            <th className="text-left pl-2">Total Points Used</th>
                            <th className="text-left pl-2">Redeem Number</th>
                            <th className="text-left pl-2">Status</th>
                            <th className="text-left pl-2">Create</th>
                            <th className="text-left pl-2">Update</th>
                        </tr>
                    </thead>

                    <tbody>

                        {redeemRewards.length === 0 && error && (
                            <tr>
                                <td colSpan={8} className="p-6 text-gray-500">
                                    Redeem reward not found
                                </td>
                            </tr>
                        )}

                        {redeemRewards.map(redeemReward => (

                            <tr
                                key={redeemReward.id}
                                className="border-t border-gray-300 transition-all duration-100 hover:shadow-xl cursor-pointer "
                                onClick={() => navigate(`/admin/redeem-rewards/detail/${redeemReward.id}`)}
                            >

                                <td className="pl-2 py-4">
                                    {redeemReward.id}
                                </td>

                                <td className="pl-2 py-4">
                                    {redeemReward.user_id}
                                </td>

                                <td className="pl-2 py-4 w-45">
                                    {redeemReward.total_points_used} pts
                                </td>

                                <td className="pl-2 py-4 w-">
                                    {redeemReward.redeem_number}
                                </td>

                                <td className="pl-2 py-4">
                                    {redeemReward.status}
                                </td>

                                <td className="pl-2 py-4">
                                    {formatDate(redeemReward.created_at)}
                                </td>

                                <td className="pl-2 py-4">
                                    {formatDate(redeemReward.updated_at)}
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <div className="flex justify-between">

                {isSearchResult && redeemRewards.length > 0 && (
                    <button
                        onClick={() => navigate(`/admin/redeem-rewards/detail/${redeemRewards[0].id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-4"
                    >
                        view Details
                    </button>



                )}
                <div className="pt-4">

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>

        </div>
    )
}