interface CartProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartSideBar({ isOpen, onClose }: CartProps) {
    return (
        <div className="font-baskerville">
            {/* BACKDROP */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={onClose}
                />
            )}

            {/* DRAWER */}
            <div
                className={`fixed top-0 right-0 h-full w-105 bg-white z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b">

                    <h2 className="text-xl font-semibold">
                        My Cart (2)
                    </h2>

                    <button onClick={onClose} className="text-xl">
                        ✕
                    </button>

                </div>

                {/* CART ITEMS */}
                <div className="p-6 space-y-6">

                    <div className="flex gap-4">

                        <img
                            src="/coffee.png"
                            className="w-16 h-16 object-cover"
                        />

                        <div className="flex-1">

                            <h3 className="font-medium">
                                Família Peixoto
                            </h3>

                            <p className="text-sm text-gray-500">
                                Grind Type: Whole Bean
                            </p>

                            {/* QTY */}
                            <div className="flex items-center gap-3 mt-2">

                                <button className="border px-2">-</button>
                                <span>2</span>
                                <button className="border px-2">+</button>

                            </div>

                        </div>

                        <p className="font-semibold">
                            $33.98
                        </p>

                    </div>

                </div>

                {/* FOOTER */}
                <div className="absolute bottom-0 w-full border-t p-6">

                    <div className="flex justify-between mb-4">
                        <p>Total</p>
                        <p className="font-semibold">$33.98</p>
                    </div>

                    <button className="w-full bg-black text-white py-3 rounded-lg">
                        Checkout
                    </button>

                </div>

            </div>
        </div>
    )
}