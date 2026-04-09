import type { PaginationProps } from "../type/pagination.type";


export default function Pagination({
    page,
    totalPages,
    onPageChange
}: PaginationProps) {
    return (
        <div className="flex gap-6">
            <button
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 rounded disabled:opacity-50disabled:cursor-not-allowed cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
            >
                Prev
            </button>

            <span className="px-4 py-2 flex items-center">
                {page} / {totalPages || 1}
            </span>

            <button
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 rounded disabled:opacity-50disabled:cursor-not-allowed cursor-pointer transition-transform duration-150 active:scale-90 hover:scale-105"
            >
                Next
            </button>
        </div>
    )
}

