
interface Product {
    id: number
    name: string
    taste: string
    price: number
    reward_points: number
    image_url: string
}

export function ProductCard({ products }: { products: Product[] }) {
    return (
        <div className="grid grid-cols-4 gap-10">

            {products.map((product) => (
                <div key={product.id} className="h-100 w-65">

                    <div className="bg-gray-100 rounded-2xl flex justify-center">
                        <img
                            src={product.image_url}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between mt-1">
                            <h3 className="font-semibold text-[20px]">
                                {product.name}
                            </h3>

                            <p className="font-semibold text-[16px]">
                                ฿ {product.price}
                            </p>
                        </div>

                        <p className="text-black/70 mt-1 pt-3 text-[16px]">
                            {product.taste}
                        </p>
                    </div>
                </div>
            ))}

        </div>
    )
}