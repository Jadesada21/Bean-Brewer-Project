import type { CategoryFilterProps } from "../../../type/reward/categoryfilter.type"




export default function CategoryFilter({
    selected,
    onChange
}: CategoryFilterProps) {

    const category = [
        { label: "Coffee Grinder", value: "3" },
        { label: "Camping Equipment", value: "4" },
        { label: "Coffee Server", value: "5" },
        { label: "Pour Over Kettle", value: "6" },
        { label: "Paper Filter", value: "7" },
        { label: "Coffee Dripper", value: "8" }
    ]

    return (
        <div className="flex flex-col gap-4 cursor-pointer">

            {category.map((items) => (
                <label key={items.value} className="flex items-center gap-3 cursor-pointer">

                    <input
                        type="radio"
                        name="category"
                        checked={selected.includes(items.value)}
                        onChange={() => onChange([items.value])}
                        className="w-5 h-5"
                    />

                    <span>{items.label.charAt(0).toUpperCase() + items.label.slice(1)}</span>

                </label>
            ))}
        </div>
    )
}