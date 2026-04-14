type FilterComponentProps = {
    selected: string[]
    onChange: (value: string[]) => void
}

export interface FilterConfig {
    key: string
    label: string
    component: React.ComponentType<FilterComponentProps>
}

export interface FilterSidebarProps {
    filters: FilterConfig[]
    searchParams: URLSearchParams
    setSearchParams: (params: Record<string, string>) => void
}

