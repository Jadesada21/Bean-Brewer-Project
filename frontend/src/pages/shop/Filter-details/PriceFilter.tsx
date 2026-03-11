

interface PriceFilterProps {
    selected: string[]
    onChange: (value: string[]) => void
}

export default function PriceFilter({
    selected,
    onChange
}: PriceFilterProps) {

    const prices = [
        "any",
        "300-600 ฿",
        "400-700 ฿",
        "500-800 ฿"
    ]

    return (
        <div>

            <div className="space-y-3">

                {prices.map((price) => (
                    <label
                        key={price}
                        className="flex items-center gap-3 cursor-pointer"
                    >

                        <input
                            type="radio"
                            name="price"
                            checked={selected.includes(price)}
                            onChange={() => onChange([price])}
                        />

                        <span>{price}</span>

                    </label>
                ))}

            </div>

        </div>
    )
}