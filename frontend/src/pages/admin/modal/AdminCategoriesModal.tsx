import { useState } from "react"
import { api } from "../../../AxiosInstance"
import type { CategoriesModalProps } from "../../../type/admin/modal/admincategoriesmodal.type"

type Props = {
    onSuccess: () => void
}

export const AdminCategoriesModal = ({ onSuccess }: Props) => {

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [form, setForm] = useState<CategoriesModalProps>({
        name: "",
        type: "product"
    })

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form
            }

            await api.post(`/admin/categories`, payload)
            alert("Create Categories Success")

            setForm({
                name: "",
                type: "product"
            })
            onSuccess()
            setShowCreateModal(false)
        } catch (err) {
            alert("Create Categories Failed")
        }
    }

    const handleType = (value: "reward" | "product") => {
        setForm({ ...form, type: value });
    };

    return (
        <div className="font-baskerville">
            <div className="mt-8 pl-3 mb-8">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="border rounded bg-emerald-500 w-50 h-10 text-white cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                >
                    Create Categories +
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

                        <div className="space-y-4">

                            {/* name */}
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

                            {/* type */}
                            <div>
                                <label className="block mb-2 ">Type</label>
                                <select
                                    value={form.type}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    onChange={(e) =>
                                        handleType(e.target.value as "product" | "reward")
                                    }
                                >
                                    <option value="product">Product</option>
                                    <option value="reward">Reward</option>
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