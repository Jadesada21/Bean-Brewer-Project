import type { PointsFilterProps } from "../../../type/reward/pointfilter.type"




export default function PointsFilter({
    selected,
    onChange
}: PointsFilterProps) {

    const points = [
        { label: "any", value: "any" },
        { label: "10-100 pts", value: "10-100" },
        { label: "101-200 pts", value: "101-200" },
        { label: "201-300 pts", value: "201-300" },
        { label: "301-400 pts", value: "301-400" },
        { label: "401-500 pts", value: "401-500" },
        { label: "500+ pts", value: "501-9999" }
    ]
    return (
        <div>

            <div className="space-y-3 cursor-pointer">

                {points.map((point) => (
                    <label
                        key={point.value}
                        className="flex items-center gap-3 cursor-pointer"
                    >

                        <input
                            type="radio"
                            name="points"
                            checked={selected.includes(point.value)}
                            onChange={() => onChange([point.value])}
                        />

                        <span>{point.label}</span>

                    </label>
                ))}

            </div>

        </div>
    )
}