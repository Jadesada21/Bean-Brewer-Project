import { useParams } from 'react-router-dom'


export default function ShopDetailPage() {
    const { id } = useParams()

    return (
        <div className="text-5xl">Hello ShopDetailPage</div>
    )
}