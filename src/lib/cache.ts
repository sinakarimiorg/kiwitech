import { revalidateTag, unstable_cache } from "next/cache"

export type CacheTag = "products" | "banners" | "categories" | "articles" | "comments" | "settings"

export function invalidate(...tags: CacheTag[]) {
    for (const tag of tags) revalidateTag(tag, { expire: 0 })
}

const DEFAULT_REVALIDATE_SECONDS = 300

export function cachedQuery<A extends unknown[], R>(
    name: string,
    tags: CacheTag[],
    fn: (...args: A) => Promise<R>,
    fallback: R,
    revalidate = DEFAULT_REVALIDATE_SECONDS
): (...args: A) => Promise<R> {
    const cached = unstable_cache(fn, [name], { tags, revalidate })
    return async (...args: A) => {
        try {
            return await cached(...args)
        } catch (error) {
            console.error(`[cache:${name}]`, error)
            return fallback
        }
    }
}
