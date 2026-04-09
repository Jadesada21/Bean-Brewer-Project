import type { RoastLevelFilterProps } from "../../../type/shop/roastlevelfilter.type"



export default function RoastLevelFilter({
    selected,
    onChange
}: RoastLevelFilterProps) {

    const roastLevels = [
        "light",
        "medium",
        "dark"
    ]

    return (
        <div className="flex flex-col gap-4 cursor-pointer">

            {roastLevels.map((level) => (
                <label key={level} className="flex items-center gap-3 cursor-pointer">

                    <input
                        type="radio"
                        name="roast_level"
                        checked={selected.includes(level)}
                        onChange={() => onChange([level])}
                        className="w-5 h-5"
                    />

                    <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>

                </label>
            ))}
        </div>
    )
}