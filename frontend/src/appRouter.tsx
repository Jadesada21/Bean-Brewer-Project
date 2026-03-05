import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


import Home from "./pages/HomePage"
import ShopPage from "./pages/shop/ShopPage"
import RewardPage from "./pages/reward/RewardPage"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">

                <Navbar />

                <main className="grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shops" element={<ShopPage />} />
                        <Route path="/rewards" element={<RewardPage />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter >
    )
}

