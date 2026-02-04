import { db } from "@/db"
import { todo } from "@/db/schema"
import { authFnMiddleware } from "@/middlewares/auth"
import { filterSearchSchema } from "@/schemas/search"
import { createServerFn } from "@tanstack/react-start"
import { and, count, desc, eq, like } from "drizzle-orm"

export const getUserTodos = createServerFn({
    method: 'GET',
})
    .middleware([authFnMiddleware])
    .inputValidator(filterSearchSchema)
    .handler(async ({ context, data }) => {
        const { pageIndex, pageSize, query } = data
        const offset = pageIndex * pageSize

        const whereConditions = [eq(todo.userId, context.session.user.id)]

        if (query && query.trim()) {
            whereConditions.push(like(todo.title, `%${query}%`))
        }

        const result = await db.query.todo.findMany({
            where: and(...whereConditions),
            orderBy: desc(todo.createdAt),
            offset,
            limit: pageSize
        })
        console.log({ query })

        const [todos] = await db.select({ count: count() })
            .from(todo).where(and(...whereConditions))

        return {
            todosCount: todos?.count || 0,
            todos: result,
        }
    })