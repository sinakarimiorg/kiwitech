// Solar calendar date (for article cards)

export function getPersianDateParts(dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date()
    return {
        day: date.toLocaleDateString('fa-IR', { day: 'numeric' }),
        month: date.toLocaleDateString('fa-IR', { month: 'long' }),
        year: date.toLocaleDateString('fa-IR', { year: 'numeric' }),
    }
}

// Time Over For Offers
const IRAN_OFFSET_MS = 3.5 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export function getEndOfIranDay(): number {
    const iranNow = Date.now() + IRAN_OFFSET_MS
    const iranEndOfDay = (Math.floor(iranNow / DAY_MS) + 1) * DAY_MS
    return iranEndOfDay - IRAN_OFFSET_MS
}