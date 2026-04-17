import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import { formatDate } from '../../components/FormatDate'
import { formatNumeric } from '../../components/FormatNumeric'
import type { UsersProps } from '../../type/admin/adminusers.type'
import type { ApiError } from '../../type/apierror.type'
import axios from 'axios'



export default function AdminUsers() {
    const navigate = useNavigate()

    const [users, setUsers] = useState<UsersProps[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [error, setError] = useState("")
    const [total, setTotal] = useState(0)

    const limit = 10
    const totalPages = Math.ceil(total / limit)


    const fetchUsers = async () => {
        try {
            const { data } = await api.get(`/admin/users?page=${page}`)
            setUsers(data.data)
            setTotal(data.total)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page])

    const handleSearch = async () => {
        try {
            setError("")

            if (!search.trim()) {
                const { data } = await api.get('/admin/users?page=1')
                setUsers(data.data)
                setIsSearchResult(false)
                return
            }
            const { data } = await api.get(`/admin/users/${search}`)

            setUsers([data.data])
            setIsSearchResult(true)
        } catch (err: unknown) {
            if (axios.isAxiosError<ApiError>(err)) {
                const status = err.response?.status
                const message = err.response?.data?.message

                if (status === 404) {
                    setUsers([])
                    setError(message ?? "Users not found")
                } else if (status === 400) {
                    setError(message ?? "Bad request")
                } else {
                    setError(message ?? "Something went wrong")
                }
            } else {
                setError("Unexpected Error")
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">
                <h1 className="text-2xl font-semibold">
                    Users
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
                            placeholder="Search User ID"
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


            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 h-15">
                            <tr>
                                <th className="text-left pl-2">ID</th>
                                <th className="text-left pl-2">Username</th>
                                <th className="text-left pl-2">First Name</th>
                                <th className="text-left pl-2">Last Name</th>
                                <th className="text-left pl-2">Email</th>
                                <th className="text-left pl-2">Phone Number</th>
                                <th className="text-left pl-2">Points</th>
                                <th className="text-left pl-2">Role</th>
                                <th className="text-left pl-2">Is Active</th>
                                <th className="text-left pl-2">Create</th>
                                <th className="text-left pl-2">Update</th>
                            </tr>
                        </thead>

                        <div className="">
                            {users.length === 0 && error && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-gray-500">
                                        Users not found
                                    </td>
                                </tr>
                            )}
                        </div>

                        {users.map(user => (

                            <tr
                                key={user.id}
                                className="border-t border-gray-300 transition-all duration-100 hover:shadow-xl cursor-pointer  "
                                onClick={() => navigate(`/admin/users/detail/${user.id}`)}
                            >

                                <td className="py-4 px-2">
                                    {user.id}
                                </td>

                                <td className="py-4 px-2">
                                    {user.username}
                                </td>

                                <td className="max-w-45 py-4 px-2 truncate">
                                    {user.first_name}
                                </td>

                                <td className="py-4 px-2 ">
                                    {user.last_name}
                                </td>

                                <td className="py-4 px-2">
                                    {user.email}
                                </td>

                                <td className="py-4 px-2">
                                    {user.phone_num}
                                </td>

                                <td className="py-4 px-2">
                                    {formatNumeric(user.points)}
                                </td>

                                <td className="py-4 px-2">
                                    {user.role}
                                </td>

                                <td className="py-4 px-2">
                                    {user.is_active ? "Active" : "Inactive"}
                                </td>

                                <td className="py-4 px-2">
                                    {formatDate(user.created_at)}
                                </td>

                                <td className="py-4 px-2">
                                    {formatDate(user.updated_at)}
                                </td>



                            </tr>
                        ))}
                    </table>
                </div>
            </div>
            <div className="flex justify-between">
                {isSearchResult && users.length > 0 && (
                    <button
                        onClick={() => navigate(`/admin/users/detail/${users[0].id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-4 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
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