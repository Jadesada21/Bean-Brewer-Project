import { useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"


export default function CartDrawer({ open, onClose }: any) {

    const navigate = useNavigate()
    const { cart, removeItem, checkout } = useCart()

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    )



    return (
        <div className="font-baskerville">
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed right-0 top-0 h-full w-105 bg-white z-50
        transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
            >

                <div className="h-20 p-6 border-b flex justify-between">
                    <h2 className="text-xl font-semibold">
                        My Cart ({cart.length})
                    </h2>

                    <button onClick={onClose} className="cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105">✕</button>
                </div>

                <div className="p-6 space-y-6">

                    {cart.map((item) => (

                        <div key={item.cart_item_id} className="flex gap-4">
                            <img
                                src={item.image_url}
                                className="w-16 h-16 object-cover"
                            />

                            <div className="flex-1 flex flex-col gap-2">
                                {/* row 1 */}
                                <div className="flex justify-between items-start">
                                    <p className="font-medium text-[18px]">
                                        {item.name}
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.cart_item_id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <img
                                            src="https://res.cloudinary.com/dbraczg5a/image/upload/v1773260385/trash-svgrepo-com_ssobd4.svg"
                                            alt="BIN"
                                            className="w-5 h-5 transition-transform duration-150 active:scale-90 hover:scale-105 cursor-pointer"
                                        />
                                    </button>
                                </div>

                                <div>
                                    <p className="text-[12px] text-black/80">
                                        {item.bag_size}
                                    </p>
                                </div>

                                {/* row 2 */}
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity}
                                    </p>

                                    <p className="font-semibold">
                                        ฿ {item.price * item.quantity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                <div className="absolute bottom-0 w-full p-6 border-t">

                    <div className="flex justify-between mb-4">
                        <p>Total</p>
                        <p className="font-semibold">${total}</p>
                    </div>

                    <button
                        onClick={async () => {
                            try {
                                const orderId = await checkout()
                                navigate(`/profile/orders/${orderId}`)
                            } catch (err) {
                                alert("Checkout failed")
                            }
                        }}
                        className="w-full bg-black text-white py-3 rounded-lg cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    )
}