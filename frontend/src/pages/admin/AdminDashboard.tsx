import { useAuth } from "../../context/AuthContext"

export default function AdminDashboard() {

    const { user } = useAuth()

    return (
        <div>

            <h1 className="text-3xl font-semibold mb-6">
                Dashboard
            </h1>

            <p className="text-gray-600 mb-10">
                Welcome back, {user?.username}
            </p>

            {/* Cards */}
            <div className="grid grid-cols-4 gap-6">

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <h2 className="text-2xl font-bold mt-2">128</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Revenue</p>
                    <h2 className="text-2xl font-bold mt-2">฿24,500</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Users</p>
                    <h2 className="text-2xl font-bold mt-2">542</h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Redeems</p>
                    <h2 className="text-2xl font-bold mt-2">89</h2>
                </div>

            </div>

        </div>
    )
}