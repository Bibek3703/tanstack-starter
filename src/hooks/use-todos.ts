import { createTodo, deleteTodo, deleteTodos, getUserTodos, updateTodo } from '@/data/todo'
import { authClient } from '@/lib/auth-client'
import { todoColumnSchema, todoFormSchema } from '@/schemas/todo'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import z from 'zod'

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

export const useCreateTodo = () => {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession()

    return useMutation({
        mutationFn: (todo: z.infer<typeof todoFormSchema>) => createTodo({
            data: {
                ...todo,
                userId: session?.user?.id || "",
            }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-todos"] });
            toast.success("Todo created successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create comment");
        },
    });
};

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession()

    return useMutation({
        mutationFn: (todo: z.infer<typeof todoColumnSchema>) => updateTodo({
            data: {
                ...todo,
                userId: session?.user?.id || "",
            }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-todos"] });
            toast.success("Todo updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update todo");
        },
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession()

    return useMutation({
        mutationFn: (id: string) => deleteTodo({
            data: {
                id,
                userId: session?.user?.id || "",
            }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-todos"] });
            toast.success("Todo deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete todo");
        },
    });
};

export const useDeleteTodos = () => {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession()

    return useMutation({
        mutationFn: (ids: string[]) => deleteTodos({
            data: {
                ids,
                userId: session?.user?.id || "",
            }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-todos"] });
            toast.success("Todos deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete todos");
        },
    });
};
