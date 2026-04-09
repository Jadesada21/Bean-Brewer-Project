import { useState } from "react"
import type { PromoCodeModalProps } from "../../../type/admin/modal/adminpromocodemodal.type"
import { api } from "../../../AxiosInstance"

type Props = {
    onSuccess: () => void
}

export const AdminPromoCodeModal = ({ onSuccess }: Props) => {

    const [open, setOpen] = useState(false)
    const [form, setForm] = useState<PromoCodeModalProps>({
        code: "",
        bonus_points: "",
        max_usage: ""
    })

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                bonus_points: Number(form.bonus_points),
                max_usage: Number(form.max_usage)
            }

            await api.post(`/admin/promo-codes`, payload)
            alert("Add address success")

            setForm({
                code: "",
                bonus_points: "",
                max_usage: ""
            })
            onSuccess?.()
            setOpen(false)
        } catch (err) {
            console.error(err)
            alert("Add address failed")
        }
    }



    return (
        <div className="font-baskerville">
            <div className="mt-8 pl-3 mb-8">
                <button
                    onClick={() => setOpen(true)}
                    className="border bg-emerald-500 w-50 h-10 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                >
                    Create Promo Code +
                </button>
            </div>

            {/* Modal */}
            {open && (
                <div>
                    <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 max-w-xl">
                        <div>
                            <p className="pb-2">Code</p>
                            <input
                                className="border px-2 py-1 rounded"
                                placeholder="Code"
                                value={form.code}
                                maxLength={80}
                                onChange={(e) =>
                                    setForm({ ...form, code: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <p className="pb-2">Bonus Points</p>
                            <input
                                className="border px-2 py-1 rounded"
                                type="number"
                                placeholder="0"
                                maxLength={80}
                                value={form.bonus_points}
                                onChange={(e) =>
                                    setForm({ ...form, bonus_points: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <p className="pb-2">Max Usage</p>
                            <input
                                className="border px-2 py-1 rounded"
                                type="number"
                                placeholder="0"
                                maxLength={80}
                                value={form.max_usage}
                                onChange={(e) =>
                                    setForm({ ...form, max_usage: e.target.value })
                                }
                            />
                        </div>
                    </div>


                    <div className="mt-auto pt-6 flex justify-start gap-3">
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-emerald-500 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 bg-gray-300 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}