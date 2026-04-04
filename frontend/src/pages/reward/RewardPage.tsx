import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../AxiosInstance"
import { FilterSidebar } from '../../components/FilterSidebar'
import { ItemCard } from "../../components/ItemCard";
import PointsFilter from "./filter-details/PointFilter";
import CategoryFilter from "./filter-details/CategoryFilter";
import Pagination from "../../components/Pagination";


interface Reward {
    id: number
    name: string
    points_required: number
    image_url: string
}

export default function RewardPage() {

    const [searchParams, setSearchParams] = useSearchParams()
    const [rewards, setRewards] = useState<Reward[]>([])
    const [openFilter, setOpenFilter] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const limit = 9
    const totalPages = Math.ceil(total / limit)

    const points = searchParams.get("points") || "any"
    const category = searchParams.get("category") ?? undefined

    const fetchRewards = async () => {
        const res = await api.get("/rewards", {
            params: {
                points,
                category,
                page
            }
        })
        setRewards(res.data.rewards)
        setTotal(res.data.total)
    }

    useEffect(() => {
        fetchRewards()
    }, [searchParams, page])


    const filters = [
        {
            key: "points",
            label: "Points",
            component: PointsFilter
        },
        {
            key: "category",
            label: "Category",
            component: CategoryFilter
        }
    ]

    return (
        <>
            <main className="font-baskerville w-full py-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-12 ">

                    {/* Upper */}
                    <div className="flex items-center text-sm md:text-base">
                        <Link to='/'
                            className="transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Home
                        </Link>
                        <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                            alt="right-vector"
                            className="pl-2 h-6 w-7" />
                        <p className="pl-2 font-semibold">All Reward</p>
                    </div>

                    <div className="mt-16 md:mt-24 xl:mt-32 text-4xl md:text-5xl xl:text-6xl leading-tight">
                        All Reward
                    </div>

                    <div className="mt-4 md:mt-6 max-w-2xl text-sm md:text-base">
                        Discover exclusive rewards you can redeem with your points.
                    </div>

                    <div className="mt-16 md:mt-20 flex xl:flex-row  gap-6">

                        {/* < xl (mobile + tablet + md) */}
                        <div className="flex xl:hidden justify-center w-full">
                            <button
                                onClick={() => setOpenFilter(true)}
                                className="flex items-center gap-3 px-6 py-2 border-t border-b w-full h-15 justify-center hover:text-white transition"
                            >
                                <img
                                    src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773164370/filter-list-add-svgrepo-com_wfzplr.svg"
                                    className="w-5 h-5"
                                />
                                Filters
                            </button>
                        </div>


                        {/* ≥ xl (desktop ใหญ่) */}
                        <div className="hidden xl:flex items-center justify-between w-full xl:w-75">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773164370/filter-list-add-svgrepo-com_wfzplr.svg"
                                    alt="filter-icon"
                                    className="w-8 h-8"
                                />
                                <p className="text-xl font-semibold">Filters</p>
                            </div>

                            <button
                                onClick={() => setSearchParams({})}
                                className="text-base font-semibold text-[#f45048] underline"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Reward Section */}
                    <section className="mt-10 flex flex-col xl:flex-row gap-8 xl:gap-12">

                        {/* Filter Sidebar */}
                        <div className="hidden xl:block w-full xl:w-70">
                            <FilterSidebar
                                filters={filters}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                            />
                        </div>

                        <div className="flex-1 flex flex-col">
                            {/* Reward Grid */}
                            <div className="flex-1 grid gap-6 grid-cols-1 justify-items-center md:grid-cols-2 md:justify-items-center xl:justify-items-center xl:grid-cols-2 2xl:grid-cols-3">
                                {rewards.map((reward) => (
                                    <Link key={reward.id} to={`/rewards/${reward.id}`}>
                                        <ItemCard
                                            variant="reward"
                                            image={reward.image_url}
                                            name={reward.name}
                                            points={reward.points_required}
                                        />
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={(newPage) => setPage(newPage)}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {openFilter && (
                    <div className="fixed inset-0 z-50 flex xl:hidden">

                        {/* overlay */}
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setOpenFilter(false)}
                        />

                        {/* drawer */}
                        <div className="relative ml-auto w-75 h-full bg-white p-6 overflow-y-auto">

                            {/* header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Filters</h2>

                                <button onClick={() => setOpenFilter(false)}>
                                    ✕
                                </button>
                            </div>

                            {/* filter */}
                            <FilterSidebar
                                filters={filters}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                            />

                            {/* clear */}
                            <button
                                onClick={() => setSearchParams({})}
                                className="mt-6 text-red-500 underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </main >
        </>
    )
}