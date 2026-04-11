import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import type { DashboardProps } from "../../type/admin/admindashboard.type"
import { api } from "../../AxiosInstance"
import { formatNumeric } from "../../components/FormatNumeric"

export default function AdminDashboard() {

    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [datas, setDatas] = useState<DashboardProps | null>(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const { data } = await api.get(`/admin/dashboard`)
            console.log(data)
            setDatas(data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <div>Loading...</div>

    if (!datas) return <div>No Data to show</div>

    return (
        <div>

            <h1 className="text-3xl font-semibold mb-6">
                Dashboard
            </h1>

            <p className="text-gray-600 mb-10">
                Welcome back, {user?.username}
            </p>

            {/* Cards */}

            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.totalUsers ?? "No Data")}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.totalOrders ?? "No Data")}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Completed Orders</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.completedOrders ?? "No Data")}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Revenues</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.totalRevenues ?? "No Data")}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Products</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.totalProducts ?? "No Data")}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Rewards</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.totalRewards ?? "No Data")}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Redeems</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.totalRedeems ?? "No Data")}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total PromoCodes</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.totalPromoCodes ?? "No Data")}</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Used PromoCodes</p>
                    <h2 className="text-2xl font-bold mt-6">{formatNumeric(datas.totalUsedPromoCodes ?? "No Data")}</h2>
                </div>



            </div>



        </div>
    )
}