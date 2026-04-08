
export const getStatusStyle = (status: string) => {
    switch (status) {
        case "completed":
            return "text-green-600"
        case "cancelled":
            return "text-red-600"
        case "pending":
            return "text-yellow-600"
        default:
            return "text-gray-600"
    }
}