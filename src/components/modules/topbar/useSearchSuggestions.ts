"use client"

import { useEffect, useState } from 'react'
import { searchSuggestionsAction, type SearchSuggestionsResult } from './searchActions'

const EMPTY: SearchSuggestionsResult = { products: [], articles: [] }
export const MIN_QUERY_LENGTH = 2

export function useSearchSuggestions(query: string, delay = 250) {
    const [state, setState] = useState<{ query: string; data: SearchSuggestionsResult }>({ query: '', data: EMPTY })

    useEffect(() => {
        if (query.length < MIN_QUERY_LENGTH) return

        let cancelled = false
        const timer = setTimeout(async () => {
            try {
                const data = await searchSuggestionsAction(query)
                if (!cancelled) setState({ query, data })
            } catch {
                if (!cancelled) setState({ query, data: EMPTY })
            }
        }, delay)

        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [query, delay])

    const active = query.length >= MIN_QUERY_LENGTH

    return {
        data: active ? state.data : EMPTY,
        isLoading: active && state.query !== query,
    }
}
