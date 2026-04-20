import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { api } from "../../AxiosInstance"
import { useCart } from "../../context/CartContext"
import OrderDetailModal from "../modal/order/OrderDetailModal"
import { useAuth } from "../../context/AuthContext"
import BoxModal from "../login-signup/BoxModal"
import type { Order, Product } from "../../type/shop/shopdetailpage.type"


export default function ShopDetailPage() {
    const { id } = useParams()

    const { user } = useAuth()
    const { addToCart } = useCart()

    const navigate = useNavigate()

    const [product, setProduct] = useState<Product | null>(null)
    const [qty, setQty] = useState(1)

    const [open, setOpen] = useState(false)
    const [order, setOrder] = useState<Order | null>(null)
    const [openLoginModal, setOpenLoginModal] = useState(false)

    const fetchProduct = async () => {
        const { data } = await api.get(`/products/${id}`)
        setProduct(data.data)
    }

    useEffect(() => {
        fetchProduct()
    }, [id])


    const handleAddToCart = () => {

        if (!user) {
            setOpenLoginModal(true)
            return
        }

        if (!product) return

        addToCart(product.id, qty)
    }


    const handleBuyNow = async () => {
        try {

            if (!user) {
                setOpenLoginModal(true)
                return
            }

            const { data } = await api.post("/orders", {
                items: [
                    {
                        product_id: product?.id,
                        quantity: qty
                    }
                ]
            })

            setOrder({
                ...data.data,
                items: [
                    {
                        product_name: product?.name,
                        price: product?.price,
                        quantity: qty
                    }
                ]
            })

            setOpen(true)

        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = async () => {
        if (!order) return null

        try {

            await api.patch(`/orders/${order.id}/cancel`)

            setOrder({
                ...order,
                status: 'cancelled'
            })

            setOpen(false)
        } catch (err) {
            console.log(err)
        }
    }

    const handlePayNow = async () => {
        if (!order) return

        setOpen(false)

        navigate(`/payments/${order.id}`)
    }


    if (!product) return <div>Loading...</div>

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-baskerville">

            <div className="flex flex-wrap items-center justify-center xl:justify-start pb-10 gap-2">
                <Link to='/' className="transition-transform duration-150 active:scale-90 hover:scale-105">
                    Home
                </Link>

                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                    alt="right-vector"
                    className="pl-2 h-6 w-7" />

                <Link to='/shops'><p className=" pl-2 transition-transform duration-150 active:scale-90 hover:scale-105">
                    All Specialty Coffee
                </p>
                </Link>

                <img src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773165802/right-arrow-svgrepo-com_mhdnwz.svg"
                    alt="right-vector"
                    className="pl-2 h-6 w-7" />
                <p className="font-semibold">{product.name}</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-16">

                {/* Image */}
                <div className="bg-gray-100 rounded-2xl flex items-center justify-center p-6 xl:p-10">
                    <img
                        src={product.image_url}
                        className="
                        w-full max-w-70
                        sm:max-w-87.5
                        md:max-w-105
                        xl:max-w-125
                        object-contain rounded-2xl mx-auto"
                    />
                </div>

                {/* Detail */}
                <div className="text-center xl:text-left">

                    <p className="text-sm tracking-widest text-gray-500 uppercase">
                        {product.category}
                    </p>

                    <h1 className="text-2xl sm:text-3xl xl:text-4xl font-serif mt-2">
                        {product.name}
                    </h1>

                    <p className="text-xl sm:text-2xl mt-4 font-medium">
                        ฿ {product.price}
                    </p>

                    <p className="text-xl sm:text-2xl mt-4 font-medium">
                        {product.reward_points} pts
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

                    <div className="mt-4 flex items-center gap-4 border rounded-lg w-30 mx-auto xl:mx-0">
                        <button
                            onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                            className="w-10 h-10 text-2xl pb-1 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            -
                        </button>

                        <span className="text-lg">
                            {qty}
                        </span>

                        <button
                            onClick={() => setQty(qty + 1)}
                            className="w-10 h-10 text-2xl pb-1 cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105 "
                        >
                            +
                        </button>

                    </div>

                    {/* Add to cart */}

                    <div className="mt-6 flex flex-col gap-4 max-w-md mx-auto xl:mx-0">
                        <button
                            onClick={handleAddToCart}
                            disabled={!product}
                            className="cursor-pointer w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="cursor-pointer w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-transform duration-150 active:scale-90 hover:scale-105"
                        >
                            Buy Now
                        </button>
                    </div>
                    {open && (
                        <OrderDetailModal
                            order={order}
                            onClose={() => setOpen(false)}
                            onPay={handlePayNow}
                            onCancel={handleCancel}
                        />
                    )}
                </div>

                {openLoginModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-105">
                            <BoxModal close={() => setOpenLoginModal(false)} />
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}