import { useEffect, useState } from 'react'
import { api } from '../../AxiosInstance'
import Pagination from '../../components/Pagination'
import { formatDate } from '../../components/FormatDate'
import { AdminProductModal } from './modal/AdminProductModal'
import type { Category } from '../../type/admin/admincategories.type'



export default function AdminCategories() {


    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [editingId, setEditingId] = useState<number | null>(null)

    const limit = 10
    const totalPages = Math.ceil(total / limit)

    const [form, setForm] = useState({
        name: ""
    })

    const fetchCategorys = async () => {
        try {
            const { data } = await api.get(`/admin/categories?page=${page}`)
            setCategories(data.data)
            setTotal(data.total)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategorys()
    }, [page])

    const handleEditBtn = async (id: number) => {
        try {
            await api.patch(`/admin/categories/${id}`, {
                name: form.name
            })

            setEditingId(null)
            fetchCategorys()
        } catch (err) {
            console.error(err)
            alert("Update Categories Name Failed")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="font-baskerville">

            <div className="flex justify-between  mb-6">
                <h1 className="text-2xl font-semibold">
                    Categories
                </h1>
            </div>

            <div className="mt-8 pl-3 mb-8">
                <AdminProductModal onSuccess={fetchCategorys} />
            </div>


            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 h-15">
                            <tr>
                                <th className="text-left pl-2">ID</th>
                                <th className="text-left pl-2">name</th>
                                <th className="text-left pl-2">parent_id</th>
                                <th className="text-left pl-2">Create</th>
                                <th className="text-left pl-2">Update</th>
                                <th className="text-left pl-2">Edit Button</th>
                            </tr>
                        </thead>

                        <div className="">
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-gray-500">
                                        Product not found
                                    </td>
                                </tr>
                            )}
                        </div>

                        {categories.map(categorie => (

                            <tr
                                key={categorie.id}
                                className="border-t border-gray-300"
                            >

                                <td className="py-4 px-2">
                                    {categorie.id}
                                </td>

                                <td className="py-4 px-2">
                                    {editingId === categorie.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Categories name"
                                            value={form.name}
                                            onChange={handleChange}
                                            maxLength={60}
                                            disabled={!editingId}
                                            className="w-full border rounded px-3 py-2 mt-1"
                                        />
                                    ) : (
                                        <p className="border p-2 rounded border-none">
                                            {categorie.name}
                                        </p>
                                    )}
                                </td>

                                <td className="max-w-45 py-4 px-2 truncate">
                                    {categorie.parent_id ?? "No Parent"}
                                </td>

                                <td className="py-4 px-2">
                                    {formatDate(categorie.created_at)}
                                </td>

                                <td className="py-4 px-2">
                                    {formatDate(categorie.updated_at)}
                                </td>

                                <td>
                                    {!editingId && (
                                        <button
                                            className="border rounded px-2 py-2 ml-6 bg-blue-500 text-white cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                                            onClick={() => {
                                                setEditingId(categorie.id)
                                                setForm({ name: categorie.name })
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>

            <div className="flex justify-between pt-3">
                <div className="flex gap-6 pt-4">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>

                {editingId && (
                    <div className="mt-auto pt-6 flex justify-end gap-3">
                        <button
                            onClick={() => handleEditBtn(editingId)}
                            className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-300 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Cancel
                        </button>

                    </div>
                )}
            </div>

        </div >
    )
}