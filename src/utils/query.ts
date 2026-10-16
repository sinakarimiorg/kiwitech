// fix undefined and null values in query params
export function buildQuery(params: Record<string, string | undefined | null>): string {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value) search.set(key, value)
    })
    const query = search.toString()
    return query ? `?${query}` : ''
}

// Delete special characters from a string to use it in regex
export function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
