import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay?: number): { isLoading: boolean, debouncedValue: T } {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => {
            setDebouncedValue(value)
            setIsLoading(false)
        }, delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return { isLoading, debouncedValue }
}