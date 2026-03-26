import { Outlet, useNavigate, useLocation } from "react-router-dom"

import { useAuth } from "../../context/AuthContext"
import { useState } from "react"

export default function ProfilesPage() {

    const [openSidebar, setOpenSidebar] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout(navigate)
    }

    const capitalize = (text?: string) => {
        if (!text) return ""
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

    const isActive = (path: string) => {
        return location.pathname === path
    }

    const menuClass = (path: string) => {
        return `cursor-pointer text-lg pt-3 font-baskerville border-b transition-all duration-150 
        active:scale-95 hover:scale-105
        ${isActive(path) ? "border-black" : "border-transparent"}`
    }

    const go = (path: string) => {
        navigate(path)
        setOpenSidebar(false)
    }

    return (
        <div className="flex h-full relative font-baskerville">

            {/* ✅ Mobile menu */}
            <button
                onClick={() => setOpenSidebar(true)}
                className="lg:hidden absolute left-4 z-30 bg-white px-4 py-2 rounded-lg shadow 
                font-semibold transition active:scale-90 hover:scale-105 mt-5"
            >
                Menu
            </button>

            {/* ✅ Overlay (mobile) */}
            {openSidebar && (
                <div
                    onClick={() => setOpenSidebar(false)}
                    className="fixed inset-0 bg-black/30 z-30 xl:hidden"
                />
            )}


            {/* sidebar */}
            <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-white pt-20 px-4 z-30
                transform transition-transform duration-300
                ${openSidebar ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:sticky lg:top-0
                 `}>

                {/* ❌ Close button (mobile) */}
                <div className="md:hidden flex justify-end mb-4">
                    <button onClick={() => setOpenSidebar(false)}>✕</button>
                </div>


                <div className="flex flex-col items-center space-y-4 overflow-y-auto h-full pb-10">
                    {/* profile */}
                    <button
                        onClick={() => go("/profile")}
                        className={menuClass("/profile")}
                    >
                        Profiles
                    </button>

                    <button
                        onClick={() => go("/profile/address")}
                        className={menuClass("/profile/address")}
                    >
                        Address
                    </button>


                    <button
                        onClick={() => go("/profile/payments")}
                        className={menuClass("/profile/payments")}
                    >
                        Payment History
                    </button>

                    <button
                        onClick={() => go("/profile/orders")}
                        className={menuClass("/profile/orders")}
                    >
                        Order History
                    </button>

                    <button
                        onClick={() => go("/profile/rewards-redeem")}
                        className={menuClass("/profile/rewards")}
                    >
                        Reward History
                    </button>

                    <button
                        onClick={() => go("/profile/redeems")}
                        className={menuClass("/profile/redeem")}
                    >
                        Redeem Code History
                    </button>

                    <button
                        onClick={() => go("/profile/points")}
                        className={menuClass("/profile/points")}
                    >
                        Point History
                    </button>

                    {/* Logout */}
                    <div className="pt-6">
                        <button
                            onClick={handleLogout}
                            className="border px-4 py-2 rounded font-bold transition-all duration-150 active:scale-95 hover:scale-105"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </aside >


            {/* content */}
            <main className="mt-25 max-w-3xl w-full 
                    pl-4 md:pl-6 xl:pl-8 lg:pl-10 
                    md:ml-6 xl:ml-50">

                <div className="text-2xl font-bold">
                    Hi, {capitalize(user?.username)} 👋
                </div>

                {/* Page content */}
                <Outlet />
            </main>
        </div >
    )
}