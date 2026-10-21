import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// false on the server and during the hydration pass, true right after.
// Use it for UI that depends on client-only state (localStorage-backed Redux cart, etc.)
// so the first client render matches the server HTML, regardless of Suspense timing.
export const useIsClient = () =>
    useSyncExternalStore(subscribe, () => true, () => false)
