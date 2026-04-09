export interface FilterConfig {
    key: string
    label: string
    component: any
}

export interface FilterSidebarProps {
    filters: FilterConfig[]
    searchParams: URLSearchParams
    setSearchParams: (params: any) => void
}