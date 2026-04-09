import { useEffect, useState } from 'react'
import { api } from '../AxiosInstance'
import { Link } from 'react-router-dom'
import type { Product, SearchProps } from '../type/search.type'




export default function Search({ open, setOpen }: SearchProps) {

    const [keyword, setKeyword] = useState("")
    const [products, setProducts] = useState<Product[]>([])

    const showProducts = keyword.trim() !== ""

    useEffect(() => {

        if (!keyword.trim()) {
            setProducts([])
            return
        }

        const fetchProducts = async () => {
            try {
                const res = await api.get(`/products/search?keyword=${keyword}`)
                setProducts(res.data.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchProducts()

    }, [keyword])

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center pt-20 z-50">

            <div className="bg-white w-225 rounded-lg p-6 shadow-xl h-130">

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
                        className="text-xl cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                    >
                        ✕
                    </button>

                </div>

                {/* Product Section */}
                {showProducts && (

                    <div>

                        <p className="text-sm text-gray-500 mb-4">
                            PRODUCTS
                        </p>

                        <div className="grid grid-cols-3 gap-8">

                            {products.map((p) => (
                                <Link
                                    to={`/shops/${p.id}`}
                                    key={p.id}
                                    className="text-center hover:scale-105 transition"
                                    onClick={() => setOpen(false)}
                                >

                                    <img
                                        src={p.image_url}
                                        className="w-28 mx-auto mb-3"
                                    />

                                    <p className="font-medium">
                                        {p.name}
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        ฿ {p.price}
                                    </p>

                                </Link>
                            ))}

                        </div>

                    </div>

                )}

            </div>

        </div >
    )
}