import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../../../AxiosInstance"

import { ToggleActiveBtn } from "../../../components/IsActive"
import { RestockBtn } from "../../../components/Restock"
import { DeleteImagesModal } from "../../../components/adminModal/DeleteImagesModal"
import { UploadModal } from "../../../components/adminModal/UploadImagesModal"
import { formatDate } from "../../../components/FormatDate"
import { formatNumeric } from "../../../components/FormatNumeric"

import type { ProductDetail, ProductImage } from "../../../type/admin/detail/AdminProductDetail.type"

export default function AdminProductDetails() {

    const { id } = useParams()

    const [isEditing, setIsEditing] = useState(false)
    const [products, setProducts] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [primaryImage, setPrimaryImage] = useState<string | null>(null)


    const fetchProductsDetail = async () => {
        try {
            const { data } = await api.get(`/admin/products/${id}`)
            setProducts(data.data)
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
        reward_points: 0,
        roast_level: "",
        taste: "",
        bag_size: "",
        description: ""
    })

    useEffect(() => {
        if (products && !isEditing) {
            setForm({
                name: products.name ?? "",
                price: products.price ?? 0,
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

    const handleSelectImage = async (img: ProductImage) => {
        const prev = primaryImage

        setPrimaryImage(img.image_url || null)

        try {
            await api.patch(`/admin/products/${id}/images/primary`, {
                image_id: img.id
            })
            console.log(img.id)

            setProducts(prevProducts => {
                if (!prevProducts) return prevProducts

                return {
                    ...prevProducts,
                    images: prevProducts.images?.map(i => ({
                        ...i,
                        is_primary: i.id === img.id
                    }))
                }
            })
        } catch (err) {
            console.error(err)
            setPrimaryImage(prev)
        }
    }

    useEffect(() => {
        if (products) {
            const img =
                products.images?.find(i => i.is_primary)?.image_url ||
                products.images?.[0]?.image_url || null

            setPrimaryImage(img)
        }
    }, [products])

    if (loading) {
        return <div>loading...</div>
    }

    if (!products) return <div>Product not found</div>

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
                            className="px-4 py-2 text-black rounded border cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
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
                            products.images.map((img) => {
                                const isActive = primaryImage === img.image_url

                                return (
                                    < img
                                        key={img.id}
                                        src={img.image_url}
                                        onClick={() => handleSelectImage(img)}
                                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition
                                                ${isActive
                                                ? "border-blue-500 scale-105"
                                                : "border-transparent hover:scale-105"}
                                        `}
                                    />
                                )
                            })
                        ) : (
                            <span className="text-gray-400 text-sm">No images</span>
                        )}
                    </div>

                    {/* Delete Button + Upload Button */}
                    <div className="flex gap-10 pt-3">
                        <div>
                            <DeleteImagesModal
                                id={products.id}
                                resource="products"
                                images={
                                    products.images?.map((img) => ({
                                        id: img.id,
                                        url: img.image_url ?? "",
                                        name: `Image ${img.id}`,
                                    })) ?? []
                                }
                                onImagesUpdate={(updatedImages) => {
                                    const newImages: ProductImage[] =
                                        updatedImages.map((img) => {
                                            const old = products.images?.find((p) => p.id === img.id);
                                            return {
                                                id: img.id,
                                                image_url: img.url,
                                                is_primary: old?.is_primary || false,
                                            };
                                        }) ?? [];

                                    setProducts((prev) =>
                                        prev ? { ...prev, images: newImages } : prev
                                    );
                                }}
                                onClose={() => { }}
                            />
                        </div>

                        <div>
                            <UploadModal
                                id={products.id}
                                resource="products"
                            />
                        </div>
                    </div>


                    {/* Is Active  */}
                    <div className="pt-2 text-xl">
                        Status: {products.is_active ? "Active" : "Inactive"}
                    </div>

                    <ToggleActiveBtn
                        id={products.id}
                        resource="products"
                        isActive={products.is_active}
                        onChange={(val) => {
                            setProducts(prev => prev ? { ...prev, is_active: val } : prev)
                        }}
                    />
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
                                <p className="mt-1 border p-2 rounded">
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
                                <p className="mt-1 border p-2 rounded">
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
                                maxLength={1000}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        ) : (
                            <p className="mt-1 border p-2 rounded">
                                {products.description}
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

                    {/* restock */}
                    <div>
                        <label className="block text-sm font-medium pb-2">ReStock</label>

                        <RestockBtn
                            id={products.id}
                            resource="products"
                            onSuccess={(qty) => {
                                setProducts(prev => {
                                    if (!prev) return prev

                                    return {
                                        ...prev,
                                        stock: prev.stock + qty
                                    }
                                })
                            }}
                        />
                    </div>

                    {/* Actions */}
                    {isEditing && (
                        <div className="mt-auto pt-6 flex justify-end gap-3">
                            <button
                                onClick={patchProductDetail}
                                className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                            >
                                Cancel
                            </button>

                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}