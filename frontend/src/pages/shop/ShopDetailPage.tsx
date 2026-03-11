import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { api } from "../../AxiosInstance"
import { useCart } from "../../context/CartContext"


interface Product {
    id: number
    name: string
    description: string
    price: number
    image_url: string
    roast_level: string
    category: string
    taste: string
    bag_size: string
}

export default function ShopDetailPage() {
    const { id } = useParams()

    const [product, setProduct] = useState<Product | null>(null)
    const [qty, setQty] = useState(1)


    const fetchProduct = async () => {
        const res = await api.get(`/products/${id}`)
        setProduct(res.data.data)
    }

    useEffect(() => {
        fetchProduct()
    }, [])

    const { addToCart } = useCart()

    if (!product) return <div>Loading...</div>

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-baskerville">

            <div className="flex font-baskerville items-center pb-10">
                <Link to='/'>Home</Link>
                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                    alt="right-vector"
                    className="pl-2 h-6 w-7" />
                <Link to='/shops'><p className="pl-2 ">All Specialty Coffee</p></Link>
                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                    alt="right-vector"
                    className="pl-2 h-6 w-7" />
                <p className="font-semibold">{product.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-16">

                {/* Image */}
                <div className="bg-gray-100 rounded-2xl flex items-center justify-center p-10">
                    <img
                        src={product.image_url}
                        className="w-120 object-contain"
                    />
                </div>

                {/* Detail */}
                <div>

                    <p className="text-sm tracking-widest text-gray-500 uppercase">
                        {product.category}
                    </p>

                    <h1 className="text-4xl font-serif mt-2">
                        {product.name}
                    </h1>

                    <p className="text-2xl mt-4 font-medium">
                        ฿ {product.price}
                    </p>

                    <p className="mt-6 leading-relaxed">
                        {product.taste}
                    </p>

                    <p className="mt-6 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Roast */}
                    <div className="mt-6">
                        <p className="text-xl mb-2 uppercase font-bold">
                            {product.roast_level} ROAST
                        </p>
                    </div>

                    <p className="mt-6 text-gray-600 leading-relaxed">
                        {product.bag_size}
                    </p>

                    {/* Quantity */}
                    <div className="mt-8">Quantity</div>

                    <div className="mt-3 flex items-center gap-4 border rounded-lg w-30">
                        <button
                            onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                            className="w-10 h-10 text-2xl pb-1"
                        >
                            -
                        </button>

                        <span className="text-lg">
                            {qty}
                        </span>

                        <button
                            onClick={() => setQty(qty + 1)}
                            className="w-10 h-10 text-2xl pb-1"
                        >
                            +
                        </button>

                    </div>

                    {/* Add to cart */}

                    <button
                        onClick={() => addToCart(product.id, qty)}
                        className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
                    >
                        Add to Cart
                    </button>

                    <button
                        className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
                    >
                        Buy Now
                    </button>

                </div>

            </div>

        </div>
    )
}