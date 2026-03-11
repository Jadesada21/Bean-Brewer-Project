import RoastLevelFilter from "./Filter-details/RoastlevelFilter"
import PriceFilter from "./Filter-details/PriceFilter"
import { useState } from 'react'

type FilterKey = "roast_level" | "price"

const filters = [
    {
        key: "roast_level" as FilterKey,
        label: "Roast Level",
        component: RoastLevelFilter
    },
    {
        key: "price" as FilterKey,
        label: "Price",
        component: PriceFilter
    }
]

export function FilterSidebar({ searchParams, setSearchParams }: any) {
    const [openFilter, setOpenFilter] = useState<string | null>(null)

    const selectedPrice = searchParams.get("price") || "any"
    const selectedRoast = searchParams.get("roast_level") ?? undefined

    return (
        <>
            {/* ===== Filter + Product layout ===== */}
            <div className="flex border-t border-gray-300">

                {/* Filters sidebar */}
                <div className="w-75">
                    {filters.map((filter) => {

                        const FilterComponent = filter.component
                        const isOpen = openFilter === filter.key

                        return (
                            <div key={filter.key} className="border-b border-gray-300">

                                {/* Header */}
                                <button
                                    onClick={() =>
                                        setOpenFilter(isOpen ? null : filter.key)
                                    }
                                    className="flex justify-between items-center w-full py-6"
                                >

                                    <span className={`
                                    font-baskerville text-lg 
                                    ${isOpen ? "text-black font-semibold" : "text-gray-500"
                                        }`}
                                    >
                                        {filter.label}
                                    </span>

                                    <span className="text-2xl">
                                        {isOpen ? "x" : "+"}
                                    </span>

                                </button>


                                {/* Filter Content */}
                                {isOpen && filter.key === "roast_level" && (
                                    <div className="pb-6">
                                        <FilterComponent
                                            selected={[selectedRoast]}
                                            onChange={(value: string[]) => {
                                                const params: any = {}
                                                if (selectedPrice !== "any") {
                                                    params.price = selectedPrice
                                                }
                                                if (value[0]) {
                                                    params.roast_level = value[0]
                                                }
                                                setSearchParams(params)
                                            }}
                                        />
                                    </div>
                                )}


                                {isOpen && filter.key === "price" && (
                                    <div className="pb-6">
                                        <FilterComponent
                                            selected={[selectedPrice]}
                                            onChange={(value: string[]) => {
                                                const params: any = {
                                                    price: value[0]
                                                }
                                                if (selectedRoast) {
                                                    params.roast_level = selectedRoast
                                                }
                                                setSearchParams(params)
                                            }}
                                        />
                                    </div>
                                )}

                            </div>
                        )
                    })}
                </div>
            </div >
        </>
    )
}