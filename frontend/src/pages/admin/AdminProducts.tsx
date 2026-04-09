import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import type { Product } from '../../type/admin/adminproduct.type'



export default function AdminProduct() {
    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [error, setError] = useState("")
    const [total, setTotal] = useState(0)

    const limit = 10
    const totalPages = Math.ceil(total / limit)


    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products?page=${page}`)
            setProducts(res.data.products)
            setTotal(res.data.total)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [page])

    const handleSearch = async () => {
        try {
            setError("")

            if (!search.trim()) {
                const res = await api.get('/admin/products?page=1')
                setProducts(res.data.data)
                setIsSearchResult(false)
                return
            }
            const res = await api.get(`/admin/products/${search}`)

            setProducts([res.data.data])
            setIsSearchResult(true)
        } catch (err: any) {

            if (err.response?.status === 404) {
                setProducts([])
                setError("Product not found")
            }
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">
                <h1 className="text-2xl font-semibold">
                    Products
                </h1>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSearch()
                    }}
                >
                    <div>
                        <input
                            type="text"
                            placeholder="Search Product ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 rounded"
                        />

                        <button
                            onClick={handleSearch}
                            className="bg-emerald-500 text-white px-4 py-2 rounded ml-5 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>


            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 h-15">
                            <tr>
                                <th className="text-left pl-2">ID</th>
                                <th className="text-left pl-2">Image</th>
                                <th className="text-left pl-2">Name</th>
                                <th className="text-left pl-2">Price</th>
                                <th className="text-left pl-2">Stock</th>
                                <th className="text-left pl-2">Reward Points</th>
                                <th className="text-left pl-2">Roaste Level</th>
                                <th className="text-left pl-2">Is Active</th>
                                <th className="text-left pl-2">Create</th>
                                <th className="text-left pl-2">Update</th>
                            </tr>
                        </thead>

                        <div className="">
                            {products.length === 0 && error && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-gray-500">
                                        Product not found
                                    </td>
                                </tr>
                            )}
                        </div>

                        {products.map(product => (

                            <tr
                                key={product.id}
                                className="border-t border-gray-300 transition-all duration-100 hover:shadow-xl cursor-pointer  "
                                onClick={() => navigate(`/admin/products/detail/${product.id}`)}
                            >

                                <td className="py-4 px-2">
                                    {product.id}
                                </td>

                                <td className="py-4 px-2">
                                    {product.total_images}
                                </td>

                                <td className="max-w-45 py-4 px-2 truncate">
                                    {product.name}
                                </td>

                                <td className="py-4 px-2 ">
                                    ฿ {product.price}
                                </td>

                                <td className="py-4 px-2">
                                    {product.stock}
                                </td>

                                <td className="py-4 px-2">
                                    {product.reward_points} pts
                                </td>

                                <td className="py-4 px-2">
                                    {product.roast_level.toUpperCase()}
                                </td>

                                <td className="py-4 px-2">
                                    {product.is_active ? "Active" : "Inactive"}
                                </td>

                                <td className="py-4 px-2">
                                    {new Date(product.created_at).toLocaleDateString()}
                                </td>

                                <td className="py-4 px-2">
                                    {new Date(product.updated_at).toLocaleDateString()}
                                </td>



                            </tr>
                        ))}
                    </table>
                </div>
            </div>
            <div className="flex justify-between">
                {isSearchResult && products.length > 0 && (
                    <button
                        onClick={() => navigate(`/admin/products/detail/${products[0].id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-4"
                    >
                        view Details
                    </button>
                )}
                <div className="flex gap-6 pt-4">

                    {!isSearchResult && (
                        <>
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}