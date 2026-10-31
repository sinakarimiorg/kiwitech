"use client"

import { useEffect, useRef } from "react"

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * رفتار استاندارد دسترسی‌پذیر برای مودال/دراور:
 * - Escape بسته می‌کند (مگر busy باشد)
 * - Tab / Shift+Tab داخل مودال می‌چرخد (focus trap)
 * - فوکوس هنگام باز شدن داخل مودال می‌رود و هنگام بسته شدن به عنصر قبلی برمی‌گردد
 * - اسکرول صفحه‌ی پشت قفل می‌شود
 *
 * ref را روی خودِ پنل (عنصر role="dialog") بگذارید.
 */
export function useDialog<T extends HTMLElement = HTMLDivElement>(onClose: () => void, busy = false) {
    const ref = useRef<T>(null)
    const onCloseRef = useRef(onClose)
    const busyRef = useRef(busy)

    // آخرین مقدار را نگه می‌داریم تا effect با هر رندر دوباره اجرا نشود (و فوکوس نپرد)
    useEffect(() => {
        onCloseRef.current = onClose
        busyRef.current = busy
    })

    useEffect(() => {
        const panel = ref.current
        const previouslyFocused = document.activeElement as HTMLElement | null
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        const getFocusable = () =>
            panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.offsetParent !== null) : []

        // اگر خود فیلدی autoFocus نگرفته باشد، فوکوس روی پنل می‌رود تا صفحه‌خوان عنوان را بخواند
        if (panel && !panel.contains(document.activeElement)) panel.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (!busyRef.current) {
                    event.stopPropagation()
                    onCloseRef.current()
                }
                return
            }
            if (event.key !== "Tab" || !panel) return

            const items = getFocusable()
            if (items.length === 0) {
                event.preventDefault()
                panel.focus()
                return
            }
            const first = items[0]
            const last = items[items.length - 1]
            const active = document.activeElement

            if (event.shiftKey && (active === first || active === panel)) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && active === last) {
                event.preventDefault()
                first.focus()
            } else if (!panel.contains(active)) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("keydown", onKeyDown)
            document.body.style.overflow = previousOverflow
            previouslyFocused?.focus?.()
        }
    }, [])

    return ref
}
