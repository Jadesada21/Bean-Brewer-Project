export const safeNumber = (v: string | null | undefined): number => {
    const n = Number(v ?? 0)
    return isNaN(n) ? 0 : n
}
