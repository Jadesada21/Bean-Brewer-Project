import { useState } from "react"
import { api } from "../AxiosInstance"

type Props = {
    id: number
    resource: 'products' | 'rewards'
    isActive?: boolean
    onChange?: (value: boolean) => void
}

export const ToggleActiveBtn = ({ id, resource, isActive = true, onChange }: Props) => {

    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        if (loading) return

        try {
            setLoading(true)

            await api.patch(`/admin/${resource}/${id}/toggle-active`)

            const newValue = !isActive
            onChange?.(newValue)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    return (
        <button
            onClick={handleToggle}
            className="border py-2 px-4 rounded-2xl bg-red-400 text-white cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105  "
        >
            Switch Status
        </button>
    )


}