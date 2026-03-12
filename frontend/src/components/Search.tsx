import { useState } from 'react'


export default function Search() {
    const [open, setOpen] = useState(true)
    const [keyword, setKeyword] = useState("")

    const showProducts = keyword.trim() !== ""

    if (!open) return null

    return (
        <div>

            {/* Search button */}
            <button onClick={() => setOpen(true)}>
                🔍 Search
            </button>

            {/* Overlay */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center pt-20 z-50">

                    <div className="bg-white w-[900px] rounded-lg p-6 shadow-xl">

                        {/* Search bar */}
                        <div className="flex items-center border-b pb-3 mb-6">

                            <input
                                type="text"
                                placeholder="Search coffee..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full outline-none text-lg"
                            />

                            <button
                                onClick={() => setOpen(false)}
                                className="text-xl"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Product Section */}
                        {keyword && (
                            <div>

                                <p className="text-sm text-gray-500 mb-4">
                                    PRODUCTS
                                </p>

                                <div className="grid grid-cols-3 gap-8">

                                    {products.map((p) => (
                                        <div
                                            key={p.id}
                                            className="text-center hover:scale-105 transition"
                                        >

                                            <img
                                                src={p.image}
                                                className="w-28 mx-auto mb-3"
                                            />

                                            <p className="font-medium">
                                                {p.name}
                                            </p>

                                            <p className="text-gray-500 text-sm">
                                                ${p.price}
                                            </p>

                                        </div>
                                    ))}

                                </div>

                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    )
}