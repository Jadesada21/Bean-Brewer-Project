import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom";
import { FilterSidebar } from '../../components/FilterSidebar'
import RoastLevelFilter from "./filter-details/RoastlevelFilter"
import PriceFilter from "./filter-details/PriceFilter"

import { api } from "../../AxiosInstance"

interface Product {
    id: number
    name: string
    taste: string
    price: number
    reward_points: number
    image_url: string
}

export default function PremiumPage() {

    const isComingSoon = true

    const [searchParams, setSearchParams] = useSearchParams()

    const [premiums, setPremiums] = useState<Product[]>([])

    const price = searchParams.get("price") || "any"
    const roast_level = searchParams.get("roast_level") ?? undefined

    const fetchPremiums = async () => {
        const res = await api.get("/products", {
            params: {
                price,
                roast_level
            }
        })
        setPremiums(res.data.data)
    }

    useEffect(() => {
        if (isComingSoon) return
        fetchPremiums()
    }, [searchParams.toString()])


    const filters = [
        {
            key: "roast_level",
            label: "Roast Level",
            component: RoastLevelFilter
        },
        {
            key: "price",
            label: "Price",
            component: PriceFilter
        }
    ]

    return (
        <>
            <main className="w-full h-full py-15 mb-10 px-30 font-baskerville">
                {/* Upper */}
                <div className="flex  items-center">
                    <Link to='/'>Home</Link>
                    <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                        alt="right-vector"
                        className="pl-2 h-6 w-7" />
                    <p className="pl-2 font-semibold">All Premium Coffee</p>
                </div>

                <div className="mt-40 text-6xl ">
                    All Specialty Coffee
                </div>

                <div className="mt-6 ">
                    Explore our collection of specialty coffee beans, carefully sourced and roasted fresh for the perfect cup.
                </div>

                <div className="flex-1 mx-auto gap-10 ">
                    <div className="mt-25 h-20 flex justify-between">
                        <div className="flex items-center justify-between w-75">
                            <div className="flex items-center gap-4">
                                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773164370/filter-list-add-svgrepo-com_wfzplr.svg"
                                    alt="filter-icon"
                                    className="w-10 h-10"
                                />

                                <p className="text-xl font-semibold ">Filters</p>

                            </div>

                            <button
                                onClick={() => setSearchParams({})}
                                className="text-xl font-semibold  text-[#f45048] underline cursor-pointer"
                            >
                                Clear
                            </button>
                        </div>

                    </div>
                </div>

                {/* Product Section */}
                <section className="flex gap-12 pt-8 ">

                    {/* Filter Sidebar */}
                    <div className="w-75 ">
                        <FilterSidebar
                            filters={filters}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                        />
                    </div>

                    {/* Product Grid */}
                    {isComingSoon ? (
                        <div className="pl-100">
                            <div className="relative">
                                <img src="//www.drinktrade.com/cdn/shop/files/Star_7.svg?v=1768508731&width=480"
                                    alt=""
                                />

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <img src="//www.drinktrade.com/cdn/shop/files/Ico-Coffee_d87007bd-3e01-4163-a2e7-70a51863d656.svg?v=1768508733&width=80"
                                        className="pb-3"
                                        alt="" />
                                    <p className="pb-2">Premium Products </p>
                                    <p>Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-10 grid-cols-3">
                            {premiums.map((premium) => (
                                <Link key={premium.id} to={`/shops/${premium.id}`}>

                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}