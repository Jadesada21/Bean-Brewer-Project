import { Link, useNavigate } from 'react-router-dom';
import searchIcon from "../assets/search-img.svg";
import Cart from '../assets/cart.svg';
import profile from '../assets/profile.svg';
import OpenBox from "./isopen/OpenBox";
import ShopDropdown from './dropdown/shop/ShopDropdown';
import BoxModal from '../pages/login-signup/BoxModal';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from "../context/CartContext"
import CartDrawer from './cart/CartDrawer';

export default function Navbar({ setOpenSearch }: any) {

    const [openBoxModal, setOpenBoxModal] = useState(false)

    const [openMenu, setOpenMenu] = useState(false)

    const [openCart, setOpenCart] = useState(false)

    const { cart } = useCart()

    const { user } = useAuth()
    const navigate = useNavigate()

    const handleProfileClick = () => {
        if (user) {
            navigate('/profile')
        } else {
            setOpenBoxModal(true)
        }
    }


    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    )

    return (
        <div className="w-full bg-[#f7f5ef] border-b border-gray-300 font-baskerville">
            <div className="px-4 sm:px-6 lg:px-10 flex items-center justify-between h-20 relative">

                {/* Left Menu */}
                <div className="flex items-center md:gap-4 xl:gap-10">
                    {/* HAMBURGER (mobile only) */}
                    <button
                        className="lg:hidden flex flex-col gap-1 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        onClick={() => setOpenMenu(!openMenu)}
                    >
                        <span className="w-5 h-0.5 bg-black"></span>
                        <span className="w-5 h-0.5 bg-black"></span>
                        <span className="w-5 h-0.5 bg-black"></span>
                    </button>

                    {/* LOGO */}
                    <Link
                        to="/"
                        className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
                    >
                        <p
                            className="font-bold text-3xl whitespace-nowrap">
                            BEAN
                        </p>
                    </Link>

                    {/* MENU (tablet ขึ้นไป) */}
                    <div className="hidden lg:flex items-center gap-8 ml-8">

                        <OpenBox label="Shop" >
                            <ShopDropdown />
                        </OpenBox>

                        <Link to="/rewards">
                            <p className="text-sm lg:text-base relative inline-block 
                                after:content-[''] after:absolute after:left-0 after:-bottom-1
                                after:h-px after:w-0 after:bg-black 
                                after:transition-all after:duration-300 
                                hover:after:w-full whitespace-nowrap"
                            >
                                Rewards
                            </p>
                        </Link>

                        <Link to="/about-us">
                            <p className="text-sm lg:text-base relative inline-block 
                                after:content-[''] after:absolute after:left-0 after:-bottom-1
                                after:h-px after:w-0 after:bg-black 
                                after:transition-all after:duration-300 
                                hover:after:w-full whitespace-nowrap"
                            >
                                About Us
                            </p>
                        </Link>
                    </div>
                </div>


                {/* Right Icons */}
                <div className="relative flex items-center gap-3 sm:gap-4 md:gap-8 lg:gap-10">
                    <button onClick={() => setOpenSearch(true)}>
                        <img
                            src={searchIcon}
                            alt="search"
                            className="w-7 xl:w-9 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        />
                    </button>

                    <button onClick={() => handleProfileClick()}>
                        <img
                            src={profile}
                            alt="profile"
                            className="w-6 xl:w-8 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        />
                    </button>

                    <button onClick={() => setOpenCart(true)}>
                        <img
                            src={Cart}
                            alt="cart"
                            className="w-7 xl:w-9 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        />
                    </button>

                    {totalItems > 0 && (
                        <span
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                            {totalItems}
                        </span>
                    )}
                </div>
            </div>

            <CartDrawer
                open={openCart}
                onClose={() => setOpenCart(false)}
            />

            {/* BoxModal */}
            {
                openBoxModal && (
                    <BoxModal close={() => setOpenBoxModal(false)} />
                )
            }

            {openMenu && (
                <div className="lg:hidden bg-[#f7f5ef] border-t border-gray-200  flex justify-center gap-6">
                    <OpenBox label="Shop">
                        <ShopDropdown />
                    </OpenBox>

                    <Link
                        to="/rewards"
                        onClick={() => setOpenMenu(false)}
                        className="h-17 flex items-center justify-center text-[18px]"
                    >
                        Rewards
                    </Link>

                    <Link
                        to="/about-us"
                        onClick={() => setOpenMenu(false)}
                        className="h-17 flex items-center justify-center text-[18px]"
                    >
                        About Us
                    </Link>
                </div>
            )}
        </div >
    )
}