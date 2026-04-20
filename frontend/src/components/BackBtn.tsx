import { useNavigate } from "react-router-dom";
import type { BackBtnProps } from "../type/backbtn.type";


export default function BackBtn({ to }: BackBtnProps) {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(to)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
        >
            Back
        </button>
    )
}