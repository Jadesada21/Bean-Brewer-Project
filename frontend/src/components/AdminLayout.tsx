import { Outlet } from "react-router-dom"

export default function AdminLayout() {
    return (
        <div className="flex">

            {/* <AdminSidebar /> */}

            <main className="flex-1 p-10">
                <Outlet />
            </main>

        </div>
    )
}