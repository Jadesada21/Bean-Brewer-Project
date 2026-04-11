import { useState } from "react"
import { api } from "../../../AxiosInstance"
import type { RewardModalProps } from "../../../type/admin/modal/adminrewardmodal.type"

type Props = {
    onSuccess: () => void
}

export const AdminRewardModal = ({ onSuccess }: Props) => {

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [form, setForm] = useState<RewardModalProps>({
        name: "",
        description: "",
        short_description: "",
        points_required: "",
        stock: "",
        category_id: 3
    })

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                points_required: Number(form.points_required),
                stock: Number(form.stock),
                description: form.description.replace(/\r\n/g, '\n'),
                short_description: form.short_description.replace(/\r\n/g, '\n'),
                category_id: Number(form.category_id),
            }

            await api.post(`/admin/rewards`, payload)
            alert("Create Reward Success")

            setForm({
                name: "",
                description: "",
                short_description: "",
                points_required: "",
                stock: "",
                category_id: 3
            })
            onSuccess()
            setShowCreateModal(false)
        } catch (err) {
            console.error(err)
            alert("Create Rward Failed")
        }
    }

    const categories = [
        { id: 3, name: "Coffee Grinder" },
        { id: 4, name: "Camping Equipment" },
        { id: 5, name: "Coffee Server" },
        { id: 6, name: "Pour Over Kettle" },
        { id: 7, name: "Paper Filter" },
        { id: 8, name: "Coffee Dripper" },
        { id: 9, name: "Coffee Scale" },
        { id: 10, name: "Coffee Machine" },
    ]

    const handleCategoriesChange = (value: number) => {
        setForm({ ...form, category_id: value })
    }


    return (
        <div className="font-baskerville">
            <div className="mt-8 pl-3 mb-8">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="border rounded bg-emerald-500 w-50 h-10 text-white cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                >
                    Create Reward +
                </button>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div className="bg-white p-8 rounded-xl w-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Rewards</h2>

                        {/* name */}
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 ">name</label>
                                <input
                                    type='text'
                                    name="name"
                                    value={form.name}
                                    placeholder='Name'
                                    maxLength={60}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>

                            {/* Price + stock  */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 ">Points Required</label>
                                    <input
                                        type='number'
                                        name="points_required"
                                        value={form.points_required}
                                        placeholder='0'
                                        maxLength={60}
                                        onChange={(e) =>
                                            setForm({ ...form, points_required: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 ">Stock</label>
                                    <input
                                        type='number'
                                        name="stock"
                                        value={form.stock}
                                        placeholder='0'
                                        maxLength={60}
                                        onChange={(e) =>
                                            setForm({ ...form, stock: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>
                            </div>

                            {/* description */}
                            <div>
                                <label className="block mb-2">Description</label>
                                <textarea
                                    rows={5}
                                    name="description"
                                    value={form.description}
                                    maxLength={500}
                                    placeholder="Description"
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>

                            {/* short Description */}
                            <div>
                                <label className="block mb-2">Short Description</label>
                                <textarea
                                    rows={2}
                                    name="short_description"
                                    value={form.short_description}
                                    maxLength={500}
                                    placeholder="Short Description"
                                    onChange={(e) =>
                                        setForm({ ...form, short_description: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 ">Categories ID</label>
                                <select
                                    value={form.category_id}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    onChange={(e) =>
                                        handleCategoriesChange(Number(e.target.value))
                                    }
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        {/* buttons */}
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-emerald-500 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                            >
                                Create
                            </button>

                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}