"use client"

import { useEffect } from "react"
import { trackArticleViewAction } from "./actions"

export default function ArticleViewTracker({ linkName }: { linkName: string }) {
    useEffect(() => {
        trackArticleViewAction(linkName).catch(() => { })
    }, [linkName])

    return null
}
