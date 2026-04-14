import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import type { Reward } from '../../type/admin/adminreward.type'
import { AdminRewardModal } from './modal/AdminRewardModal'
import { AxiosError } from 'axios'



export default function AdminReward() {
    const navigate = useNavigate()

    const [rewards, setRewards] = useState<Reward[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [error, setError] = useState("")
    const [total, setTotal] = useState(0)

    const limit = 10
    const totalPages = Math.ceil(total / limit)


    const fetchRewards = async () => {
        try {
            const res = await api.get(`/rewards?page=${page}`)
            setRewards(res.data.rewards)
            setTotal(res.data.total)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRewards()
    }, [page])

    const handleSearch = async () => {
        try {
            setError("")

            if (!search.trim()) {
                const res = await api.get('/admin/rewards?page=1')
                setRewards(res.data.data)
                setIsSearchResult(false)
                return
            }
            const res = await api.get(`/admin/rewards/${search}`)

            setRewards([res.data.data])
            setIsSearchResult(true)
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                const status = err.response?.status

                if (status === 404) {
                    setRewards([])
                    setError("Reward not found")
                } else if (status === 400) {
                    setError("Bad Request")
                } else {
                    setError("Something went wrong")
                }
            } else {
                setLoading(false)
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
                    Rewards
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
                            placeholder="Search Reward ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 rounded"
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

            <div className="mt-8 pl-3 mb-8">
                <AdminRewardModal onSuccess={fetchRewards} />
            </div>


            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 h-15">
                            <tr>
                                <th className="text-left pl-2">ID</th>
                                <th className="text-left pl-2">Image</th>
                                <th className="text-left pl-2">Name</th>
                                <th className="text-left pl-2">Points Required</th>
                                <th className="text-left pl-2">Stock</th>
                                <th className="text-left pl-2">Is Active</th>
                                <th className="text-left pl-2">Create</th>
                                <th className="text-left pl-2">Update</th>
                            </tr>
                        </thead>

                        <div className="">
                            {rewards.length === 0 && error && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-gray-500">
                                        Reward not found
                                    </td>
                                </tr>
                            )}
                        </div>

                        {rewards.map(reward => (

                            <tr
                                key={reward.id}
                                className="border-t border-gray-300 transition-all duration-100 hover:shadow-xl cursor-pointer  "
                                onClick={() => navigate(`/admin/rewards/detail/${reward.id}`)}
                            >

                                <td className="py-4 px-2">
                                    {reward.id}
                                </td>

                                <td className="py-4 px-2">
                                    {reward.total_images}
                                </td>

                                <td className="max-w-45 py-4 px-2 truncate">
                                    {reward.name}
                                </td>

                                <td className="py-4 px-2 ">
                                    {reward.points_required}
                                </td>

                                <td className="py-4 px-2">
                                    {reward.stock}
                                </td>

                                <td className="py-4 px-2">
                                    {reward.is_active ? "Active" : "Inactive"}
                                </td>

                                <td className="py-4 px-2">
                                    {new Date(reward.created_at).toLocaleDateString()}
                                </td>

                                <td className="py-4 px-2">
                                    {new Date(reward.updated_at).toLocaleDateString()}
                                </td>



                            </tr>
                        ))}
                    </table>
                </div>
            </div>
            <div className="flex justify-between">
                {isSearchResult && rewards.length > 0 && (
                    <button
                        onClick={() => navigate(`/admin/rewards/detail/${rewards[0].id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-4"
                    >
                        view Details
                    </button>
                )}
                <div className="flex gap-6 pt-4">

                    {!isSearchResult && (
                        <>
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}