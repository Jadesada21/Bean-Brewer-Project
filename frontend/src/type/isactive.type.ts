export type Props = {
    id: number
    resource: 'products' | 'rewards'
    isActive?: boolean
    onChange?: (value: boolean) => void
}