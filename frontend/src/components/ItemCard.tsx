
interface ItemCardProps {
    image: string
    name: string
    subtitle?: string
    price?: number
    points?: number
    variant: "product" | "reward"
    onClick?: () => void
}

export function ItemCard({
    image,
    name,
    subtitle,
    price,
    points,
    variant,
    onClick
}: ItemCardProps) {

    return (
        <div className="h-100 w-65 cursor-pointer font-baskerville transition-transform duration-150 active:scale-90 hover:scale-105"
            onClick={onClick}
        >

            <div className="bg-gray-300 rounded-2xl overflow-hidden flex justify-center">
                <img
                    src={image}
                    className="h-full w-full object-cover"
                />
            </div>


            {variant === 'product' && (
                <>
                    <div className="mt-4">
                        <div className="flex justify-between mt-1 gap-2">
                            <h3 className="font-semibold text-[20px] truncate flex-1 min-w-0">
                                {name}
                            </h3>

                            {price && (
                                <p className="font-semibold text-[16px] whitespace-nowrap">
                                    ฿ {price}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between mt-1 pt-3">
                        {subtitle && (
                            <p className="text-black/70 text-[16px]">
                                {subtitle}
                            </p>
                        )}

                        {points && (
                            <p className="font-semibold text-[16px]">
                                {points} pts
                            </p>
                        )}
                    </div>
                </>
            )}

            {variant === 'reward' && (
                <div className="mt-4">
                    <div className="flex flex-col mt-1">
                        <h3 className="font-semibold text-[20px] truncate h-18">
                            {name}
                        </h3>


                        {points && (
                            <p className="font-semibold text-[16px] mt-auto self-end">
                                {points} pts
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}