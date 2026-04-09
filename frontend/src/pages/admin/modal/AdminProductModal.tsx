import { useState } from "react"
import type { ProductModalProps } from "../../../type/admin/modal/adminproductmodal.type"
import { api } from "../../../AxiosInstance"

type Props = {
    onSuccess: () => void
}

export const AdminProductModal = ({ onSuccess }: Props) => {

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [form, setForm] = useState<ProductModalProps>({
        name: "",
        description: "",
        taste: "",
        roast_level: { roast_level: "light" },
        bag_size: "standard: 300 gram",
        price: "",
        stock: "",
        reward_points: "",
        category_id: "1",
    })

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                reward_points: Number(form.reward_points),
                roast_level: form.roast_level.roast_level,
                description: form.description.replace(/\r\n/g, '\n'),
                category_id: Number(form.category_id),
            }

            await api.post(`/admin/products`, payload)
            alert("Create Product Success")

            setForm({
                name: "",
                description: "",
                taste: "",
                roast_level: { roast_level: "light" },
                bag_size: "standard: 300 gram",
                price: "",
                stock: "",
                reward_points: "",
                category_id: "1",
            })
            onSuccess()
            setShowCreateModal(false)
        } catch (err) {
            console.error(err)
            alert("Create Product Failed")
        }
    }

    const handleRoastChange = (value: "light" | "medium" | "dark") => {
        setForm({ ...form, roast_level: { roast_level: value } });
    };

    return (
        <div className="font-baskerville">
            <div className="mt-8 pl-3 mb-8">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="border rounded bg-emerald-500 w-50 h-10 text-white cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                >
                    Create Product +
                </button>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div className="bg-white p-8 rounded-xl w-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">Products</h2>

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
                                    <label className="block mb-2 ">Price</label>
                                    <input
                                        type='number'
                                        name="price"
                                        value={form.price}
                                        placeholder='0'
                                        maxLength={60}
                                        onChange={(e) =>
                                            setForm({ ...form, price: e.target.value })
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

                            {/* reward points + roast level */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 ">Reward Points</label>
                                    <input
                                        type='number'
                                        name="reward_points"
                                        value={form.reward_points}
                                        placeholder='0'
                                        maxLength={60}
                                        onChange={(e) =>
                                            setForm({ ...form, reward_points: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 ">Roast Level</label>
                                    <select
                                        value={form.roast_level.roast_level}
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        onChange={(e) =>
                                            handleRoastChange(e.target.value as "light" | "medium" | "dark")
                                        }
                                    >
                                        <option value="light">Light</option>
                                        <option value="medium">Medium</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>
                            </div>

                            {/* taste + bag size */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 ">Taste</label>
                                    <input
                                        type='text'
                                        name="taste"
                                        value={form.taste}
                                        placeholder='Taste'
                                        maxLength={60}
                                        onChange={(e) =>
                                            setForm({ ...form, taste: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 ">Bag Size</label>
                                    <input
                                        type='text'
                                        name="bag_size"
                                        value={form.bag_size}
                                        maxLength={60}
                                        onChange={(e) =>
                                            setForm({ ...form, bag_size: e.target.value })
                                        }
                                        className="w-full border rounded px-3 py-2 mt-1"
                                    />
                                </div>
                            </div>

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

                            <div>
                                <label className="block mb-2">Categories Id</label>
                                <input
                                    type='number'
                                    name="category_id"
                                    value={form.category_id}
                                    maxLength={60}
                                    onChange={(e) =>
                                        setForm({ ...form, category_id: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
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