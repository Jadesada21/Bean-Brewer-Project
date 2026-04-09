import { useState } from "react";
import { api } from "../../AxiosInstance";

import type { UploadModalProps } from "../../type/uploadmodal.type";


export const UploadModal = ({ id, resource }: UploadModalProps) => {

    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [isopen, setIsOpen] = useState(false)


    const handleUpload = async () => {
        if (loading || files.length === 0) return

        const formData = new FormData()
        files.forEach(file => formData.append("images", file))

        try {
            setLoading(true)
            await api.post(`/admin/${resource}/${id}/images`, formData)

            setFiles([])
            setIsOpen(false)

            window.location.reload()

            alert(`Upload ${files.length} images successfully`)
        } catch (err) {
            console.error(err)
            alert("Failed to upload images")
        } finally {
            setLoading(false)
        }

    }

    return (

        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
            >
                Upload Images
            </button>

            {/* Modal */}
            {isopen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl w-80 flex flex-col gap-3">
                        <input
                            type="file"
                            multiple
                            className="border px-3 py-2 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setFiles(Array.from(e.target.files))
                                }
                            }}
                        />

                        <button
                            onClick={handleUpload}
                            className="bg-blue-500 text-white p-2 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Upload
                        </button>

                        <button
                            onClick={() => {
                                setFiles([])
                                setIsOpen(false)
                            }}
                            className="mt-3 text-sm text-white bg-red-500 border px-3 py-2 rounded cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )
            }
        </div>
    )
}