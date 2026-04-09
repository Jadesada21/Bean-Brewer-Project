export interface ItemCardProps {
    image: string
    name: string
    subtitle?: string
    price?: number
    points?: number
    variant: "product" | "reward"
    onClick?: () => void
}