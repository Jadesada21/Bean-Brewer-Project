export interface ImageItem {
    id: number
    url: string
    name: string
}

export interface DeleteImagesModalProps {
    resource: "products" | "rewards"
    id: number
    images: ImageItem[]
    onImagesUpdate?: (updatedImages: ImageItem[]) => void
    onClose?: () => void
}

export interface DeleteImagesResponse {
    delete_count: number;
    delete_images: ImageItem[];
}