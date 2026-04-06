import { useState } from "react"
import { api } from "../AxiosInstance"

type Props = {
    id: number
    resource: 'products' | 'rewards'
    onSuccess?: (qty: number) => void
}

export const RestockBtn = ({ id, resource, onSuccess }: Props) => {

    const [loading, setLoading] = useState(false)
    const [quantity, setQuantity] = useState("")

    const handleBtn = async () => {
        const num = Number(quantity)

        if (!quantity || num <= 0) {
            alert("กรุณาใส่จำนวนที่ถูกต้อง")
            return
        }

        if (loading) return

        try {
            setLoading(true)

            await api.post(`/admin/${resource}/${id}/restock`, {
                quantity: num
            })

            onSuccess?.(num)

            setQuantity("")
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <div>
            <input
                type="number"
                maxLength={50}
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border px-3 py-2 w-20 rounded mr-3"
            />

            <button
                onClick={handleBtn}
                className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
            >
                Add
            </button>
        </div>
    )
}