export const formatNumeric = (price?: number) => {
    if (!price) return "0"
    return price.toLocaleString()
}
