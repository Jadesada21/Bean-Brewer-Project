import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function AdminLayout() {

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `block px-4 py-2 rounded-md transition ${isActive
            ? "bg-emerald-500 text-white"
            : "text-gray-700 hover:bg-gray-200"
        }`

    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout(navigate)
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-baskerville">

            {/* SIDEBAR */}
            <aside className="w-80 bg-white border-r border-gray-200 xl:p-6">

                <h2 className="text-xl font-semibold mb-6 pt-20 ml-10">
                    Admin Panel
                </h2>

                <nav className="space-y-2 ml-10">

                    <NavLink to="/admin" end className={linkClass}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/admin/orders" className={linkClass}>
                        Orders
                    </NavLink>

                    <NavLink to="/admin/products" className={linkClass}>
                        Products
                    </NavLink>

                    <NavLink to="/admin/rewards" className={linkClass}>
                        Rewards
                    </NavLink>

                    <NavLink to="/admin/users" className={linkClass}>
                        Users
                    </NavLink>

                    <div className="pt-4">
                        <button
                            onClick={handleLogout}
                            className="cursor-pointer border px-4 py-2 rounded font-bold font-baskerville"
                        >
                            Log Out
                        </button>
                    </div>

                </nav>

            </aside>


            {/* CONTENT */}
            <main className="flex-1 p-10">

                <Outlet />

            </main>

        </div>
    )
}