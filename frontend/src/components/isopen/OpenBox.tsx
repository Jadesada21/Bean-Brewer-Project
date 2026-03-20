import { useState, useRef } from 'react'

interface OpenBoxProps {
    label: string
    children: React.ReactNode
}

export default function OpenBox({ label, children }: OpenBoxProps) {
    const [open, setOpen] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const openDropdown = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        setOpen(true)
    }

    // 👉 ปิด dropdown (มี delay)
    const closeDropdown = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
            setOpen(false)
        }, 130)
    }

    return (
        <p className="h-17 flex items-center justify-center text-[18px]">
            <span className="relative inline-block font-baskerville"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
            >
                {/* TEXT */}
                <span
                    className={` 
                        relative  inline-block  cursor-pointer after:content-[''] 
                        after:absolute after:left-0 after:-bottom-0.5 
                        after:h-px after:w-full  after:bg-black after:origin-left 
                        after:transition-transform after:duration-300
                        ${open ? "after:scale-x-100" : "after:scale-x-0"}`
                    }
                >
                    {label}
                </span>

                {/* DROPDOWN */}
                {open && (
                    <div
                        className="absolute top-11 left-23 -translate-x-1/2 mt-3 w-50 h-45 bg-[#f3efe7] rounded-3xl shadow-lg z-20"
                    >
                        {/* เมนูข้างใน */}
                        {children}
                    </div>
                )}
            </span>
        </p>
    )
}