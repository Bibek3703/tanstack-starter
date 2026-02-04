import { getUserTodos } from '@/data/todo'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

interface UseTodosParams {
    pageIndex: number
    pageSize: number
    query?: string
}

export function useUserTodos({
    pageIndex,
    pageSize,
    query
}: UseTodosParams) {

    return useQuery({
        queryKey: ["user-todos", { pageIndex, pageSize, query }],
        queryFn: () => getUserTodos({ data: { pageIndex, pageSize, query } }),
        placeholderData: keepPreviousData,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
