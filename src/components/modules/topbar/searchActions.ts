"use server"

import { searchAll } from "@root/src/lib/listQueries"

export type SuggestionProduct = {
    _id: string
    name: string
    linkName: string
    price: number
    img: string
}

export type SuggestionArticle = {
    _id: string
    title: string
    linkName: string
    img: string
}

export type SearchSuggestionsResult = {
    products: SuggestionProduct[]
    articles: SuggestionArticle[]
}

const MIN_LENGTH = 2

// ────────────────────────────────
// Live search suggestions (products + articles)
// ────────────────────────────────
export async function searchSuggestionsAction(query: string): Promise<SearchSuggestionsResult> {
    const q = (query ?? "").trim().slice(0, 60)
    if (q.length < MIN_LENGTH) return { products: [], articles: [] }

    const { products, articles } = await searchAll(q, { products: 5, articles: 3 })

    return {
        products: products.map(p => ({
            _id: p._id,
            name: p.name,
            linkName: p.linkName,
            price: p.price,
            img: p.img,
        })),
        articles: articles.map(a => ({
            _id: a._id,
            title: a.title,
            linkName: a.linkName,
            img: a.img,
        })),
    }
}
