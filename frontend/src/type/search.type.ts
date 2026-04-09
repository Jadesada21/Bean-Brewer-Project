export interface Product {
    id: number
    name: string
    price: number
    image_url: string
}

export interface SearchProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}