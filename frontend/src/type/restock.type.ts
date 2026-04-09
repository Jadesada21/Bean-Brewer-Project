export type Props = {
    id: number
    resource: 'products' | 'rewards'
    onSuccess?: (qty: number) => void
}