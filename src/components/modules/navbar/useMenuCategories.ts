"use client"

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@root/src/store/hooks'
import { fetchMenuCategories } from '@root/src/store/reducers/menuSlice'

export function useMenuCategories() {
    const dispatch = useAppDispatch()
    const categories = useAppSelector(state => state.menu.categories)
    const status = useAppSelector(state => state.menu.status)

    useEffect(() => {
        dispatch(fetchMenuCategories())
    }, [dispatch])

    return { categories, status, isLoading: status === 'idle' || status === 'loading' }
}
