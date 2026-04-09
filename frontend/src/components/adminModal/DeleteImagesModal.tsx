import { useEffect, useState } from "react"
import { api } from "../../AxiosInstance"

import type {
    DeleteImagesModalProps,
    DeleteImagesResponse,
    ImageItem
} from "../../type/deletemodal.type"

export const DeleteImagesModal = ({ id, resource, images, onImagesUpdate, onClose }: DeleteImagesModalProps) => {

    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [imageList, setImageList] = useState<ImageItem[]>([])

    useEffect(() => {
        setImageList(images);
    }, [images]);

    const toggleSelect = (imageId: number) => {
        setSelectedIds((prev) =>
            prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
        );
    };


    const handdleDeleteBtn = async () => {
        if (loading || selectedIds.length === 0) return

        try {
            setLoading(true)

            const res = await api.delete<{ data: DeleteImagesResponse }>
                (`/admin/${resource}/${id}/images`,
                    {
                        data: { image_ids: selectedIds }
                    })


            const deletedIds = res.data.data.delete_images.map((img) => img.id)

            const updatedImages = imageList.filter((img) => !deletedIds.includes(img.id))
            setImageList(updatedImages)
            onImagesUpdate?.(updatedImages)

            setSelectedIds([])

            setIsOpen(false)
            onClose?.()

            alert(`Deleted ${deletedIds.length} images successfully`)
        } catch (err) {
            console.error(err)
            alert("Failed to delete images")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        onClose?.()
    }

    return (
        <div>
            <button
                className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105 "
                onClick={() => setIsOpen(true)}
            >
                Delete Images
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg w-11/12 max-w-3xl p-6">
                        <h2 className="text-xl font-bold mb-4">Select images to delete</h2>

                        {/* Grid รูป */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 max-h-96 overflow-y-auto">
                            {imageList.map((img) => {
                                const isSelected = selectedIds.includes(img.id)

                                return (
                                    <div
                                        key={img.id}
                                        className={`relative border rounded overflow-hidden cursor-pointer" : ""
                                            }`}
                                        onClick={() => toggleSelect(img.id)}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.name}
                                            className="w-full h-24 object-cover transition-transform duration-150"
                                        />

                                        {/* checkbox แสดงอยู่มุม */}
                                        <label className="absolute top-1 left-1 bg-white p-1 rounded">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(img.id)}

                                            />

                                        </label>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105 
                                    ${selectedIds.length
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "bg-red-500 text-white cursor-not-allowed"
                                    }`}
                                onClick={handdleDeleteBtn}

                            > Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}