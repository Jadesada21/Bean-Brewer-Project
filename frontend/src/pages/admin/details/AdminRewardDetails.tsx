import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../../AxiosInstance"
import { ToggleActiveBtn } from "../../../components/IsActive"
import { RestockBtn } from "../../../components/Restock"
import { formatNumeric } from "../../../components/FormatNumeric"
import { formatDate } from "../../../components/FormatDate"
import { DeleteImagesModal } from "../../../components/adminModal/DeleteImagesModal"
import { UploadModal } from "../../../components/adminModal/UploadImagesModal"

import type { RewardImage, RewardsDetail } from "../../../type/admin/detail/adminrewarddetail.type"


export default function AdminRewardDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [isEditing, setIsEditing] = useState(false)
    const [rewards, setRewards] = useState<RewardsDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [primaryImage, setPrimaryImage] = useState<string | null>(null)

    const fetchRewardsDetail = async () => {
        try {
            const { data } = await api.get(`/admin/rewards/${id}`)
            setRewards(data.data)
        } catch (err) {
            console.error('Error fetching reward detail:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchRewardsDetail()
        }
    }, [id])


    const [form, setForm] = useState({
        name: "",
        description: "",
        short_description: "",
        points_required: 0,

    })

    useEffect(() => {
        if (rewards) {
            setForm({
                name: rewards.name ?? "",
                description: rewards.description ?? "",
                short_description: rewards.short_description ?? "",
                points_required: rewards.points_required ?? 0
            })
        }
    }, [rewards])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target

        setForm(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }))
    }

    const patchRewardDetail = async () => {
        try {
            await api.patch(`/admin/rewards/${id}`, form)
            alert("Update success")
            window.location.reload()
        } catch (err) {
            console.error('Error patching Reward detail:', err)

        }
    }

    const handleSelectImage = async (img: RewardImage) => {
        const prev = primaryImage

        setPrimaryImage(img.image_url || null)

        try {
            await api.patch(`/admin/rewards/${id}/images/primary`, {
                image_id: img.id
            })

            setRewards(prevRewards => {
                if (!prevRewards) return prevRewards

                return {
                    ...prevRewards,
                    images: prevRewards.images?.map(i => ({
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
        if (rewards) {
            const img =
                rewards.images?.find(i => i.is_primary)?.image_url ||
                rewards.images?.[0]?.image_url || null

            setPrimaryImage(img)
        }
    }, [rewards])

    if (loading) {
        return <div>loading...</div>
    }

    if (!rewards) return <div>Reward not found</div>

    return (
        <div className="p-6 font-baskerville">

            <div className="flex justify-between">
                <div className="flex items-center gap-10 pb-10">
                    <div>
                        <button
                            onClick={() => navigate("/admin/rewards")}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Back
                        </button>
                    </div>


                    <span className="text-2xl">ID# {rewards.id}</span>
                    <span className="text-2xl">{rewards.name}</span>
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
                        {rewards.images && rewards.images.length > 0 ? (
                            rewards.images.map((img) => {
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
                                id={rewards.id}
                                resource="rewards"
                                images={
                                    rewards.images?.map((img) => ({
                                        id: img.id,
                                        url: img.image_url ?? "",
                                        name: `Image ${img.id}`,
                                    })) ?? []
                                }
                                onImagesUpdate={(updatedImages) => {
                                    const newImages: RewardImage[] =
                                        updatedImages.map((img) => {
                                            const old = rewards.images?.find((p) => p.id === img.id);
                                            return {
                                                id: img.id,
                                                image_url: img.url,
                                                is_primary: old?.is_primary || false,
                                            };
                                        }) ?? [];

                                    setRewards((prev) =>
                                        prev ? { ...prev, images: newImages } : prev
                                    );
                                }}
                                onClose={() => { }}
                            />
                        </div>

                        <div>
                            <UploadModal
                                id={rewards.id}
                                resource="rewards"
                            />
                        </div>
                    </div>


                    {/* Is Active  */}
                    <div className="pt-2 text-xl">
                        Status: {rewards.is_active ? "Active" : "Inactive"}
                    </div>

                    <ToggleActiveBtn
                        id={rewards.id}
                        resource="rewards"
                        isActive={rewards.is_active}
                        onChange={(val) => {
                            setRewards(prev => prev ? { ...prev, is_active: val } : prev)
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
                                placeholder="Reward name"
                                value={form.name}
                                onChange={handleChange}
                                maxLength={60}
                                disabled={!isEditing}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        ) : (
                            <p className="mt-1 border p-2 rounded">
                                {rewards.name}
                            </p>
                        )}
                    </div>

                    {/* Points Required + Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Points Required</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="points_required"
                                    value={form.points_required}
                                    onChange={handleChange}
                                    placeholder="Price"
                                    maxLength={20}
                                    disabled={!isEditing}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            ) : (
                                <p className="mt-1 border p-2 rounded">
                                    {formatNumeric(rewards.points_required)}
                                </p>
                            )}

                        </div>

                        <div>
                            <label className="block text-sm font-medium">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formatNumeric(rewards.stock)}
                                placeholder="Stock"
                                maxLength={20}
                                disabled={!isEditing}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        </div>
                    </div>


                    {/* Short Description  */}
                    <div>
                        <label className="block text-sm font-medium">Short Description</label>
                        {isEditing ? (
                            <textarea
                                rows={2}
                                name="short_description"
                                value={form.short_description}
                                onChange={handleChange}
                                placeholder="Short Description"
                                maxLength={80}
                                disabled={!isEditing}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        ) : (
                            <p className="mt-1 border p-2 rounded">
                                {rewards.short_description}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        {isEditing ? (
                            <textarea
                                rows={5}
                                name="description"
                                value={form.description ?? ""}
                                onChange={handleChange}
                                placeholder="Description"
                                maxLength={1000}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        ) : (
                            <p className="mt-1 border p-2 rounded">
                                {rewards.description}
                            </p>
                        )}
                    </div>


                    {/* category name + type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Category Name</label>
                            <p className="w-full border rounded px-3 py-2 mt-1 bg-gray-400">
                                {rewards.category_name}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Category Type</label>
                            <p className="w-full border rounded px-3 py-2 mt-1 bg-gray-400">
                                {rewards.category_type}
                            </p>
                        </div>
                    </div>

                    {/* Created + Updated */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Created At</label>
                            <p className="w-full border rounded px-3 py-2 mt-1 bg-gray-400">
                                {formatDate(rewards.created_at)}


                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Updated At</label>
                            <p className="w-full border rounded px-3 py-2 mt-1 bg-gray-400">
                                {formatDate(rewards.updated_at)}
                            </p>
                        </div>
                    </div>


                    {/* restock */}
                    <div>
                        <label className="block text-sm font-medium pb-2">ReStock</label>

                        <RestockBtn
                            id={rewards.id}
                            resource="rewards"
                            onSuccess={(qty) => {
                                setRewards(prev => {
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
                                onClick={patchRewardDetail}
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