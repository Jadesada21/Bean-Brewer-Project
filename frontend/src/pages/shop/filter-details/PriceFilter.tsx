import type { PriceFilterProps } from "../../../type/shop/pricefilter.type"




export default function PriceFilter({
    selected,
    onChange
}: PriceFilterProps) {

    const prices = [
        { label: "Any", value: "any" },
        { label: "300-500 ฿", value: "300-500" },
        { label: "501-600 ฿", value: "501-600" },
        { label: "601-700 ฿", value: "601-700" },
        { label: "701-800 ฿", value: "701-1000" }
    ]

    return (
        <div>

            <div className="space-y-3 cursor-pointer">

                {prices.map((price) => (
                    <label
                        key={price.value}
                        className="flex items-center gap-3 cursor-pointer"
                    >

                        <input
                            type="radio"
                            name="price"
                            checked={selected.includes(price.value)}
                            onChange={() => onChange([price.value])}
                        />

                        <span>{price.label}</span>

                    </label>
                ))}

            </div>

        </div>
    )
}