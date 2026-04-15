import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { useAuth } from './context/AuthContext'
import { useState } from 'react'

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"
import Search from "./components/Search";

import TermPage from "./pages/Term";
import PrivacyPage from "./pages/Privacy";
import CookiesPage from "./pages/Cookies";

import HomePage from "./pages/HomePage"
import ShopPage from "./pages/shop/ShopPage"
import RewardPage from "./pages/reward/RewardPage"
import AboutUsPage from "./pages/AboutUs";
import ContactUsPage from "./pages/ContactUs";
import ProfilesPage from "./pages/profiles/ProfilesPage";

import ShopDetailPage from "./pages/shop/ShopDetailPage"
import PaymentPage from "./pages/payment/PaymentPage";
import PremiumPage from "./pages/shop/PremiumPage"

import RewardDetailPage from "./pages/reward/RewardDetailPage";

import ProfileForm from "./pages/profiles/ProfileForm";
import AddressForm from "./pages/profiles/AddressForm";
import PaymentHis from "./pages/profiles/PaymentHis";
import PaymentDetails from "./pages/profiles/details/PaymentDetailPage";
import OrderHis from "./pages/profiles/OrderHis";
import OrderDetails from "./pages/profiles/details/OrderDetailPage";
import RewardHis from "./pages/profiles/RewardHis";
import RedeemRewardDetails from "./pages/profiles/details/RedeemRewardPage";

import RedeemHis from "./pages/profiles/RedeemHis";
import PointHis from "./pages/profiles/PointHis";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/details/AdminOrderDetails";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetails from "./pages/admin/details/AdminProductDetails";
import AdminRewards from "./pages/admin/AdminRewards";
import AdminRewardDetails from "./pages/admin/details/AdminRewardDetails"
import AdminRedeemRewards from "./pages/admin/AdminRedeemRewards";
import AdminRedeemRewardDetails from "./pages/admin/details/AdminRedeemRewardDetails";
import AdminPayment from "./pages/admin/AdminPayment";
import AdminPaymentDetails from "./pages/admin/details/AdminPaymentDetails";
import AdminStockmove from "./pages/admin/AdminStockmove";
import AdminPromoCode from "./pages/admin/AdminPromoCode";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/details/AdminUserDetails";

import {
    HOME,
    ABOUT,
    CONTACT,
    PAYMENT,
    PROFILE,
    REWARD,
    SHOP,
    TERM,
    COOKIES,
    PRIVACY
} from "./constants/route";

import {
    ADDRESS,
    ORDERS,
    PAYMENTHIS,
    POINTS,
    REDEEMS,
    REWARDREDEEM
} from "./constants/profileRoute";
import { ADMIN, ADMINCATEGORIES, ADMINORDERS, ADMINPAYMENTS, ADMINPRODUCTS, ADMINPROMOCODES, ADMINREDEEMREWARDS, ADMINREWARDS, ADMINSTOCKMOVES, ADMINUSERS } from "./constants/adminRoute";


export default function AppRouter() {
    const { loading } = useAuth()

    const [openSearch, setOpenSearch] = useState(false)

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <BrowserRouter>
            <ScrollToTop />

            <Routes>

                {/* User layout */}
                <Route element={
                    <div className="min-h-screen flex flex-col bg-[#f7f5ef]">
                        <Navbar setOpenSearch={setOpenSearch} />

                        <Search
                            open={openSearch}
                            setOpen={setOpenSearch}
                        />

                        <main className="flex-1">
                            <Outlet />
                        </main>

                        <Footer />
                    </div>
                }>

                    <Route path={`${HOME}`} element={<HomePage />} />

                    <Route path={`${SHOP}`} element={<ShopPage />} />
                    <Route path={`${SHOP}/special`} element={<PremiumPage />} />
                    <Route path={`${SHOP}/:id`} element={<ShopDetailPage />} />

                    <Route path={`${REWARD}`} element={<RewardPage />} />
                    <Route path={`${REWARD}/:id`} element={<RewardDetailPage />} />

                    <Route path={`${PAYMENT}/:id`} element={<PaymentPage />} />

                    <Route path={`${ABOUT}`} element={<AboutUsPage />} />
                    <Route path={`${CONTACT}`} element={<ContactUsPage />} />


                    <Route
                        path={`${PROFILE}`}
                        element={<ProtectedRoute>
                            <ProfilesPage />
                        </ProtectedRoute>
                        }
                    >
                        <Route index element={<ProfileForm />} />
                        <Route path={`${ADDRESS}`} element={<AddressForm />} />
                        <Route path={`${PAYMENTHIS}`} element={<PaymentHis />} />
                        <Route path={`${PAYMENTHIS}/:id`} element={<PaymentDetails />} />
                        <Route path={`${ORDERS}`} element={<OrderHis />} />
                        <Route path={`${ORDERS}/:id`} element={<OrderDetails />} />
                        <Route path={`${REWARDREDEEM}`} element={<RewardHis />} />
                        <Route path={`${REWARDREDEEM}/:id`} element={<RedeemRewardDetails />} />
                        <Route path={`${REDEEMS}`} element={<RedeemHis />} />
                        <Route path={`${POINTS}`} element={<PointHis />} />
                    </Route>

                    <Route path={`${TERM}`} element={<TermPage />} />
                    <Route path={`${COOKIES}`} element={<CookiesPage />} />
                    <Route path={`${PRIVACY}`} element={<PrivacyPage />} />

                </Route>


                <Route
                    path={`${ADMIN}`}
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path={`${ADMINPRODUCTS}`} element={<AdminProducts />} />
                    <Route path={`${ADMINPRODUCTS}/detail/:id`} element={<AdminProductDetails />} />

                    <Route path={`${ADMINREWARDS}`} element={<AdminRewards />} />
                    <Route path={`${ADMINREWARDS}/detail/:id`} element={<AdminRewardDetails />} />

                    <Route path={`${ADMINCATEGORIES}`} element={<AdminCategories />} />

                    <Route path={`${ADMINORDERS}`} element={<AdminOrders />} />
                    <Route path={`${ADMINORDERS}/detail/:id`} element={<AdminOrderDetails />} />

                    <Route path={`${ADMINREDEEMREWARDS}`} element={<AdminRedeemRewards />} />
                    <Route path={`${ADMINREDEEMREWARDS}/detail/:id`} element={<AdminRedeemRewardDetails />} />

                    <Route path={`${ADMINPROMOCODES}`} element={<AdminPromoCode />} />

                    <Route path={`${ADMINPAYMENTS}`} element={<AdminPayment />} />
                    <Route path={`${ADMINPAYMENTS}/detail/:id`} element={<AdminPaymentDetails />} />

                    <Route path={`${ADMINSTOCKMOVES}`} element={<AdminStockmove />} />

                    <Route path={`${ADMINUSERS}`} element={<AdminUsers />} />
                    <Route path={`${ADMINUSERS}/detail/:id`} element={<AdminUserDetails />} />

                </Route>
            </Routes>
        </BrowserRouter >
    )
}

