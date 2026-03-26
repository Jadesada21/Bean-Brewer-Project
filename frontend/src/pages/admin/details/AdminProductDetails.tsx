import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../../../AxiosInstance"

interface ProductDetail {
    id: number
    name: string
    price: number
    stock: number
    description: string
    reward_points: number
    taste: string
    roast_level: string
    bag_size: string
    category_id: number
    is_active: boolean
    created_at: string
    updated_at: string

    category_name: string
    category_type: string

    images?: ProductImage[]
    total_images: number
}

export interface ProductImage {
    id: number
    image_url?: string
    is_primary: boolean
}



export default function AdminProductDetails() {

    const { id } = useParams()

    const [isEditing, setIsEditing] = useState(false)
    const [products, setProducts] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProductsDetail = async () => {
        try {
            const { data } = await api.get(`/admin/products/${id}`)
            setProducts(data.data)
            console.log(data)
        } catch (err) {
            console.error('Error fetching product detail:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchProductsDetail()
        }
    }, [id])


    const [form, setForm] = useState({
        name: "",
        price: 0,
        stock: 0,
        reward_points: 0,
        roast_level: "",
        taste: "",
        bag_size: "",
        description: ""
    })

    useEffect(() => {
        if (products) {
            setForm({
                name: products.name ?? "",
                price: products.price ?? 0,
                stock: products.stock ?? 0,
                reward_points: products.reward_points ?? 0,
                roast_level: products.roast_level ?? "",
                taste: products.taste ?? "",
                bag_size: products.bag_size ?? "",
                description: products.description ?? ""
            })
        }
    }, [products])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target

        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }))
    }

    const patchProductDetail = async () => {
        try {
            await api.patch(`/admin/products/${id}`, form)
            alert("Update success")
            window.location.reload()
        } catch (err) {
            console.error('Error patching product detail:', err)

        }
    }

    if (!products) return <div>Product not found</div>


    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB')
    }

    const formatNumeric = (price: number) => {
        return price.toLocaleString()
    }

    const getImages = (products: ProductDetail) => {
        if (products.images && products.images.length > 0) {
            return (
                products.images?.find(img => img.is_primary)?.image_url ||
                products.images?.[0]?.image_url
            )
        }
        return (products as any).image_url
    }

    const primaryImage = getImages(products)


    if (loading) {
        return <div>loading...</div>
    }


    return (
        <div className="p-6">

            <div className="flex justify-between">
                <div className="flex gap-10 pb-10 text-2xl">
                    <span>ID# {products.id}</span>
                    <span>{products.name}</span>
                </div>

                <div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 🔵 LEFT: Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="w-full h-100 bg-gray-200 rounded flex items-center justify-center">
                        {primaryImage ? (
                            <img
                                src={primaryImage}
                                className="h-full object-cover rounded"></img>
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-2 flex-wrap">
                        {products.images && products.images.length > 0 ? (
                            products.images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.image_url}
                                    className="w-20 h-20 object-cover rounded"
                                />
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">No images</span>
                        )}
                    </div>

                    {/* Upload Button */}
                    <div>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">
                            Upload Images
                        </button>
                    </div>
                </div>


                {/* 🟢 RIGHT: Form */}
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                placeholder="Product name"
                                value={form.name}
                                onChange={handleChange}
                                maxLength={60}
                                disabled={!isEditing}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        ) : (
                            <p className="mt-1 border p-2 rounded">
                                {products.name}
                            </p>
                        )}

                    </div>

                    {/* Price + Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Price</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Price"
                                    maxLength={20}
                                    disabled={!isEditing}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            ) : (
                                <p className="mt-1 border p-2 rounded">
                                    {formatNumeric(products.price)}
                                </p>
                            )}

                        </div>

                        <div>
                            <label className="block text-sm font-medium">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formatNumeric(products.stock)}
                                // onChange={}
                                placeholder="Stock"
                                maxLength={20}
                                disabled={!isEditing}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        </div>
                    </div>

                    {/* Reward Points + Roast Level */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Reward Points</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="reward_points"
                                    value={form.reward_points}
                                    onChange={handleChange}
                                    placeholder="Taste"
                                    maxLength={60}
                                    disabled={!isEditing}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            ) : (
                                <p className="mt-1 border p-2 rounded">
                                    {formatNumeric(products.reward_points)}
                                </p>
                            )}

                        </div>

                        <div>
                            <label className="block text-sm font-medium">Roast Level</label>
                            {isEditing ? (
                                <select
                                    value={products.roast_level}
                                    onChange={(e) => {
                                        setProducts(prev => prev && {
                                            ...prev,
                                            roast_level: e.target.value
                                        })
                                        window.location.reload()
                                    }}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                >
                                    <option value="light">light</option>
                                    <option value="medium">medium</option>
                                    <option value="dark">dark</option>
                                </select>
                            ) : (
                                <p className="mt-1 px-3 py-2 border p-2 rounded">
                                    {products.roast_level}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Taste + Bag Size*/}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Taste</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="taste"
                                    value={form.taste}
                                    onChange={handleChange}
                                    placeholder="Taste"
                                    maxLength={60}
                                    disabled={!isEditing}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            ) : (
                                <p className="mt-1 px-3 py-2 bg-gray-100 rounded">
                                    {products.taste}
                                </p>
                            )}

                        </div>

                        <div>
                            <label className="block text-sm font-medium">Bag Size</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="bag_size"
                                    value={form.bag_size}
                                    onChange={handleChange}
                                    placeholder="Bag Size"
                                    maxLength={60}
                                    disabled={!isEditing}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            ) : (
                                <p className="mt-1 px-3 py-2 bg-gray-100 rounded">
                                    {products.taste}
                                </p>
                            )}

                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        {isEditing ? (
                            <textarea
                                rows={2}
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description"
                                maxLength={60}
                                disabled={!isEditing}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        ) : (
                            <p className="mt-1 px-3 py-2 bg-gray-100 rounded">
                                {products.taste}
                            </p>
                        )}

                    </div>

                    {/* category name + type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Category Name</label>
                            <p className="w-full border rounded px-3 py-2 mt-1 bg-gray-400">
                                {products.category_name}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Category Type</label>
                            <p className="w-full border rounded px-3 py-2 mt-1 bg-gray-400">
                                {products.category_type}
                            </p>
                        </div>
                    </div>

                    {/* Created + Updated */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Created At</label>
                            <p className="w-full border rounded px-3 py-2 mt-1 bg-gray-400">
                                {formatDate(products.created_at)}


                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Updated At</label>
                            <p className="w-full border rounded px-3 py-2 mt-1 bg-gray-400">
                                {formatDate(products.updated_at)}
                            </p>
                        </div>
                    </div>




                    {/* Actions */}
                    {isEditing && (
                        <div className="mt-auto pt-6 flex justify-end gap-3">
                            <button
                                onClick={patchProductDetail}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}